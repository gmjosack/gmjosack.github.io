---
title: "A Simple State Machine for Godot"
date: "Sunday, April 5, 2026"
published: true
tags: ["godot", "corvian-curse"]
description: "A lightweight, code-only state machine for Godot 4."
coverImage: "/images/posts/a-simple-state-machine-for-godot/cover.png"
coverImageAlt: "Example of different states"
coverImagePosition: "0px -125px"
---

## Background

Even as far back as the precursor to [Corvian Curse](https://store.steampowered.com/app/2626080/Corvian_Curse/), [BitChunky](https://madebygare.itch.io/bit-chunky), it was clear I'd need a state machine for handling state transitions for the player and enemies. Having all of your logic dumped into `_physics_process`, even with functions to help with organization, quickly turns to spaghetti. I've seen a few patterns for doing state machines with Godot but they're often component based or spread across many files, which has never really been a pattern I liked. I want to keep as much logic as possible organized together while also being able to compare state for an entity within a single file.

I ended up building a lightweight, code-only state machine that uses inner classes and enums and it's been working out nicely so far.

## The Design

The system has two classes:

- **State** - A base class you extend to define behavior for a single state.
- **StateMachine** - Manages registered states, handles transitions, and drives the update loop.

States are defined as inner classes inside the entity that uses them. Each state gets access to two references: `fsm` (the state machine) and `obj` (the entity that owns it). States are identified by enum values.

Here's the minimal setup:

```gdscript
enum STATE { IDLE, WALKING, JUMPING }

var fsm := StateMachine.new(STATE, STATE.IDLE, self)

func _ready():
    fsm.register_state(STATE.IDLE, IdleState)
    fsm.register_state(STATE.WALKING, WalkingState)
    fsm.register_state(STATE.JUMPING, JumpingState)

func _physics_process(delta):
    fsm.physics_process(delta)
```

The `StateMachine` constructor takes three arguments: the enum dictionary, the initial state, and the owning object. You register each state by mapping an enum value to a class. Then you call `fsm.physics_process(delta)` from your `_physics_process`.

## Defining States

Each state extends `State` and overrides virtual methods to define its behavior. The most important one is `get_next_state()`. Returning an enum value causes a transition to that state:

```gdscript
class IdleState extends State:
    func get_next_state():
        if obj.velocity.y > 0:
            return STATE.FALLING
        elif obj.velocity.x != 0:
            return STATE.WALKING
        elif Input.is_action_just_pressed("jump"):
            return STATE.JUMPING

    func on_enter(_prev_state, _delta):
        obj.sprite.play("idle")

    func physics_process(delta):
        obj.apply_gravity(delta)
        obj.apply_friction(delta)
        obj.move_and_slide()
```

Here are some examples of methods you can override on the `State` class:

| Method                             | Description                                        |
| ---------------------------------- | -------------------------------------------------- |
| `get_next_state()`                 | Return a state enum value to transition            |
| `on_enter(previous_state, delta)`  | Called when entering this state                    |
| `on_exit(next_state)`              | Called when leaving this state                     |
| `physics_process(delta)`           | Called every physics frame while active            |
| `pre_enter(previous_state, delta)` | Return `false` to reject a pending transition      |
| `force_state_change()`             | Return `true` to force the machine into this state |

Each state also tracks how long it's been active via `frames_active` (physics frames) and `seconds_active` (accumulated delta). Both reset to zero on entry.

## The Lifecycle

Each physics frame, the machine runs through this sequence:

1. **`get_next_state()`** on the current state to determine if we need to transition.
2. **`force_state_change()`** on _all_ registered states to check for a forced change.
3. **`pre_enter()`** on the target state to check if we should reject the transition.
4. **`on_exit()`** on the outgoing state
5. **`on_enter()`** on the incoming state
6. **`physics_process()`** on the (now current) state

## Transition Examples

### Basic Transitions

The simplest pattern is a state that checks conditions and returns the appropriate enum:

```gdscript
class WalkingState extends State:
    func get_next_state():
        if obj.velocity.x == 0:
            return STATE.IDLE
        elif obj.velocity.y > 0:
            return STATE.FALLING
        elif Input.is_action_just_pressed("jump"):
            return STATE.JUMPING

    func on_enter(_prev_state, _delta):
        obj.sprite.play("walk")

    func physics_process(delta):
        obj.apply_gravity(delta)
        obj.apply_movement(delta)
        obj.move_and_slide()
```

If none of the conditions match, `get_next_state()` implicitly returns `null` and we stay in the current state.

### Context-Sensitive Entry

Sometimes you want `on_enter` to behave differently depending on where you came from. The `previous_state` parameter makes this straightforward:

```gdscript
class FallingState extends State:
    func on_enter(prev_state, _delta):
        if prev_state == STATE.WALKING:
            # Walked off a ledge, give a few frames of coyote time
            obj.coyote_timer = COYOTE_FRAMES
        elif prev_state == STATE.JUMPING:
            # Reached the apex of a jump
            obj.sprite.play("fall")
```

### Time-Based Transitions

The `seconds_active` and `frames_active` properties let you build time-based logic without managing your own timers:

```gdscript
class StunnedState extends State:
    var stun_duration := 0.0

    func get_next_state():
        if seconds_active >= stun_duration:
            return STATE.IDLE

    func on_enter(_prev_state, _delta):
        stun_duration = randf_range(0.5, 1.5)
        obj.sprite.play("stunned")
```

### Accessing Other State Data

State instances live in the FSM's `states` dictionary. You can reach into another state to carry data across transitions:

```gdscript
class FallingState extends State:
    func on_enter(prev_state, _delta):
        if prev_state == STATE.SLIDING:
            var slide_state = obj.fsm.states[STATE.SLIDING]
            obj.velocity.x = slide_state.slide_direction * slide_state.slide_speed
```

I don't do this often, but it's useful when you need to carry momentum or other continuous values across a transition without storing everything on the entity itself.

## Force State Changes

Most transitions flow through `get_next_state()`. The current active state decides when to transition to the next state. Sometimes there are transitions you want to always happen regardless of the current state. Rather than adding a check in every single `get_next_state()`, you can use `force_state_change()` to interrupt immediately.

Every frame, the machine calls `force_state_change()` on _all_ registered states. If any returns `true`, the machine transitions to that state regardless of what `get_next_state()` returned:

```gdscript
class HeldState extends State:
    func force_state_change():
        return obj.holder != null

    func get_next_state():
        if not obj.holder:
            return STATE.FALLING
```

This is useful for things like being grabbed, getting stunned by an environmental hazard, or any situation where the trigger lives outside the current state's awareness. I try not to use this often as it can make things harder to reason about but in a few situations it is really handy to have.

## Rejecting Transitions

Sometimes you want to prevent a state transition from happening. For this I have `pre_enter()`, which lets a target state reject a transition before it happens. This is the inverse of `force_state_change()`.

```gdscript
class DashState extends State:
    func pre_enter(_prev_state, _delta):
        return obj.dash_charges > 0
```

If `pre_enter()` returns `false`, the transition is cancelled and the machine stays in the current state. The outgoing state's `on_exit()` is never called.

## State Inheritance

Since states are just classes, you can use inheritance to share behavior between them. If you have a group of states that all need to check for the same condition, pull it into a base class:

```gdscript
class GroundedState extends State:
    func physics_process(delta):
        obj.apply_gravity(delta)
        obj.apply_friction(delta)

class IdleState extends GroundedState:
    func get_next_state():
        if obj.velocity.x != 0:
            return STATE.WALKING

    func physics_process(delta):
        super.physics_process(delta)
        obj.move_and_slide()

class WalkingState extends GroundedState:
    func get_next_state():
        if obj.velocity.x == 0:
            return STATE.IDLE

    func physics_process(delta):
        super.physics_process(delta)
        obj.apply_movement(delta)
        obj.move_and_slide()
```

This is particularly useful for enemy AI where you might have a `DetectionState` base that handles line-of-sight checks, and then idle/patrol/pursue states that inherit from it.

## Wrapping Up

I've been using this for a while now across a player controller with 15 states and a bunch of enemies with 5-7 states each. The thing I like most about it is how quick it is to spin up a new state. Just add a class and register it in the `fsm`. No new components in the scene tree or linking up new scripts.

The inner class pattern keeps all the state logic colocated with the entity it belongs to. When I'm working on the code for an enemy I can see every state it has, every transition, and every behavior without jumping between files or clicking through the scene tree. For us this feels like the right level of abstraction and it's been surprisingly powerful for what is ultimately a tiny amount of code in the library.
