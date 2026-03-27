---
title: "Rebuilding my Damage System in Godot"
date: "Wednesday, March 26, 2026"
published: true
tags: ["godot", "corvian-curse"]
coverImage: "/images/posts/rebuilding-my-damage-system-in-godot/cover.png"
coverImageAlt: "Getting hit by a corvus"
coverImagePosition: "0px -100px"
---

## Background

_If you just want to jump to the new system feel free to [skip to the design](#the-design)_

My game [Corvian Curse](https://store.steampowered.com/app/2626080/Corvian_Curse/) started as a quick jam game where I just wanted to test procedural level generation for a 2D platformer, in a similar vein to Spelunky. Once I had the level gen dialed in I set out to make a simple character controller and the obvious choice in Godot was to use a [CharacterBody2D](https://docs.godotengine.org/en/stable/classes/class_characterbody2d.html). Eventually I wanted to add some enemies and weapons and so I needed to introduce some ways to handle damage.

To start this should be pretty simple. An enemy would do contact damage to a player, and a player's weapon would do damage to the enemy. I already had a collision layer on the player, so easy, just add an [Area2D](https://docs.godotengine.org/en/stable/classes/class_area2d.html) on the enemy. If that `Area2D` detects a body that is a `Player`, call the `take_damage` method on the player. If it detects an area that is a `Weapon` then you can get the `damage` value from the weapon.

This is by no means a very strong design and I ended up having very similar signal handlers, with slight differences, for handling bodies vs areas, but it worked to get something up and running quickly. Eventually I wanted to add bonk support, and knockback support, and iframes/stun behavior. Later still I had enemies that had more than one health and I needed to detect if the hitboxes were overlapping and re-damage on a cooldown. I also had traps that could trigger damage, and items that could be thrown, that would do damage based on their velocity.

Ultimately I ended up with many different damage systems, not to mention a lot of extremely similar handling code in each of the throwable items, enemies, and traps. To give you a sense of what a handler might look like:

```gdscript
func _on_hitbox_body_entered(body):
    if holder:
        return
    if velocity.length() < 200 / weight:
        return
    if "check_allowed_collision" in body:
        if not body.check_allowed_collision(self):
            return
    if "take_damage" in body:
        body.take_damage(1, null, been_held)
```

And a similar one for areas, that would check the `area.owner`. We had code similar to this all over our entities. Also, the flow of damage was inconsistent. Sometimes damage would flow from the damage dealer to the damage receiver, and other times the receiver would poll for overlapping areas and check if it should take damage.

Recently I wanted to add a new feature where hitting an entity would apply recoil to the attacker, and decided it was time to consolidate all these systems into a cohesive design.

## The Design

I don't think there's anything revolutionary here, HitBox vs HurtBox is a well-trodden pattern, but I set out to make two components that could be used for all of my damage needs.

I settled on two Area2D components with a clear contract:

- **HitBox** - Deals damage.
- **HurtBox** - Receives damage.

Detection is always one-directional: **HitBox finds HurtBox**. Never the reverse. To enforce this pattern I configure the `HitBox` to always set [`monitorable`](https://docs.godotengine.org/en/stable/classes/class_area2d.html#class-area2d-property-monitorable) to `false`, and the `HurtBox` always sets [`monitoring`](https://docs.godotengine.org/en/stable/classes/class_area2d.html#class-area2d-property-monitoring) to `false`. In this way a `HitBox` can only ever detect a `HurtBox`.

```
HitBox (monitoring) --detects--> HurtBox (monitorable)
                                      |
                               receive_hit(event)
                                      |
                        emits knockback_received, damage_received, etc.
                                      |
                             Owner handles signals
```

A lightweight **DamageEvent** carries all the context between them - damage amount, knockback vector, source info, flags, etc.

The HitBox [`collision_mask`](https://docs.godotengine.org/en/stable/classes/class_collisionobject2d.html#class-collisionobject2d-property-collision-mask) determines what it can hit. The HurtBox [`collision_layer`](https://docs.godotengine.org/en/stable/classes/class_collisionobject2d.html#class-collisionobject2d-property-collision-layer) determines what can hit it. While the `HitBox`'s `collision_layer` isn't used for any physics interactions, I found it useful to still set the layer as metadata for filtering by damage source type.

## The Hit Pipeline

When a `HitBox` overlaps a `HurtBox`:

1. `_try_hit()` checks self-hit prevention, deduplication, velocity thresholds, and custom filters
2. Builds a `DamageEvent` with all the context
3. Calls `hurt_box.receive_hit(event)`
4. HurtBox checks invulnerability, iframes, and its own damage filter
5. If accepted: emits `knockback_received` and `damage_received` signals
6. The owner handles the signals however it wants - reduce health, die, break, play sounds

Both sides have filter callables. The HitBox has `hit_filter` for source-side rejection (e.g., "don't hit the player who just threw me"). The HurtBox has `damage_filter` for receiver-side rejection (e.g., "only accept weapon and explosion damage").

## Wiring Up a New Entity

So far this system has allowed me to tear out a ton of boilerplate. Now when I want to make a new entity that can give and receive damage the scene tree looks like:

```
Enemy (CharacterBody2D)
  +-- HitBox (Area2D, hit_box.gd)
  |     +-- CollisionShape2D
  +-- HurtBox (Area2D, hurt_box.gd)
        +-- CollisionShape2D
```

On the `HitBox` I set the collision mask to target the player's layer so that it does contact damage. I can configure things such as the damage, knockback type, whether it triggers iframes, etc. in the inspector. On the `HurtBox` I set the collision layer so the weapon can find it. Next I wire up the script for the enemy:

```gdscript
func _ready():
    $HurtBox.damage_received.connect(_on_damage_received)
    $HurtBox.knockback_received.connect(_on_knockback_received)

func _on_damage_received(event):
    health -= event.amount
    if health <= 0:
        die()

func _on_knockback_received(knockback, event):
    velocity = knockback
```

If I want to add additional behavior, such as bonking the enemy, I can just set a value on the `HurtBox` and wire up another signal. As I start switching out of feature mode into content mode, I'm going to be creating a lot more enemies, traps, items, etc. and I expect streamlining this part of the process to be extremely helpful to moving quickly.

## Wrapping Up

I don't regret my original design (if you can call it that 😂). It was, after all, something I whipped up in a couple days while building out other systems. But I do wish I'd stopped to refactor this a bit sooner. It's easy to lose track of the big picture when you're just doing incremental changes on new entities over time. Before you know it you have close to 100 entities using ~10 (okay maybe not that many) bespoke damage systems.

While it was definitely daunting, and a lot of work and testing, I'm glad I ripped the band-aid off and redid this system to a more thoughtful design that will make adding new entities much easier going forward. I kept this high-level because the pattern itself is the big win: having a single responsible component for giving damage, and another for receiving it. The classes aren't even very much code, I just had to stop and do it.

Hopefully this can be informative to someone building out a damage system in the future. Don't wait like I did or you may see the dreaded 100+ file, 1000s-line diffs across scenes and code like I did.
