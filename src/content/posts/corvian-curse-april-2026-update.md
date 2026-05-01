---
title: "Corvian Curse - April 2026 Update"
date: "Tuesday, April 28, 2026"
published: true
tags: ["godot", "corvian-curse", "release-notes"]
coverImage: "/images/posts/corvian-curse-april-2026-update/cover.png"
coverImageAlt: "TODO"
coverImagePosition: "0px -40px"
description: "Recap of the latest demo update for Corvian Curse - new threats, new modes, replays, save slots, and more."
---

<iframe src="https://store.steampowered.com/widget/2626080/" frameborder="0" width="100%" height="190"></iframe>
<hr />

Wow. Over a year since our last update and 2 since we've done any significant work on [Corvian Curse](https://store.steampowered.com/app/2626080/Corvian_Curse/). It took me a while to get back into a good groove after I started working again. Personal projects were just hard to find the time for, but for the last few months I've found a second wind and we've all been really going hard again.

<img src="/images/posts/corvian-curse-april-2026-update/commit_histogram.png" alt="Commit graph of Corvian Curse showing a two year gap with low commits">

Well, we're finally ready to release our next update, and it's a big one! Here are some of the changes you'll see in the 0.0.7.x release of our demo.

## Content Changes

While we don't want to spoil much and want you to discover the new content yourself, there are a handful of changes you'll notice while playing.

- The system for healing has been completely revamped so keep your eyes peeled for something refreshing
- New enemies are roaming the castle
- New item(s) in the merchant stand.
- New trap(s)
- Fountains now expect a donation. You're able to take a potion without it, but should you?
- Bookshelves are now destructible.
- Webs are no longer just decoration.
- The Merchant aggro has changed significantly. This is something we're still playing with but it feels a lot more dynamic than before.
- There's a new tile type you can find around the castle.
- New Hoard chunks and rooms and more rooms in general.
- Be nice to the new critters scurrying around.
- There's now an ending to the demo with a cutscene!
- You probably shouldn't linger for too long in any given level.

## Movement & Combat

We've added two new player states. **Teetering** now exists so be careful standing too close to a ledge or you may drop something. We've also added the long requested **Flip Hang** to let you safely descend into spikes or down a ledge.

Another piece of feedback we got often was that the player speed was too fast. After taking a break and coming back with a fresh perspective, we agreed, so you'll notice that the player speed feels much better now.

A few other changes:

- Up-throws now go straight up instead of in a higher forward arc. This takes a bit to get used to but adds some fun capabilities. We're still playing with this idea but give it a chance!
- Tweaks to how movement feels when holding "heavy" items.
- The teleport potion had a big change. We no longer have an ephemeral potion type. Instead, the potion is fragile and will move you through the wall where the potion collides. This makes it a lot easier to navigate back up through a level, especially paired with the changes to up-throws.

## Game Modes

We've removed Endless mode this update. We felt the demo needed a more definitive ending. To give the demo a bit more content, we've extended the castle across two areas. The second area introduces some new rooms that will appear towards the end of area 1 in the full release, along with higher spawn rates.

In its place, two new modes:

- **Seeded mode** lets you replay the same generation over and over. This is unlocked upon completing the adventure.
- **Daily mode** generates a fresh run every day that everyone plays against on the same leaderboards!

I've been having a lot of fun playing the dailies and hope to see people share their runs! We even added a text share in the death/win menus of the daily.

## Menus & UI

- **Save slots.** We added a way to have multiple save slots. From the title screen you can easily create a new slot if you wanna just do a quick AJE run or for any other reason.
- **Death replays.** When you die, you can rewatch the last 5 seconds and figure out what exactly killed you. You can also save replays, both death replays and the buffer of your current run.
- **Death messages** have also been added based on how you died.
- The leaderboards now support pagination instead of capping out at the top 25, plus a "jump to me" shortcut.
- Leaderboard layouts got cleaned up to fit longer names and more columns.
- Journal unlock toasts now show which journal entry you unlocked, and they stack if you trigger more than one in quick succession.
- A new **Feats menu** tracks in-game achievements.
- **Tutorial billboards** show up in the tutorial area to give pointers for new mechanics without dumping a wall of text on you.
- Focused nodes in menus now have a chevron to make it clear which item is selected beyond just color.

## Audio

- We've got both new and improved SFX for your listening pleasure.
- New music tracks and effects on music tracks have landed.
- Some changes to existing tracks are in, including intros to area music.

## Controls

We made a handful of changes to the key-binding system.

- **Left vs right Shift/Alt/Ctrl** are now treated as distinct keybinds. If you bind something to right-Shift, left-Shift won't trigger it.
- **Physical instead of Logical** bindings are now tracked so numpad bindings should behave the same regardless of num-lock.
- **Secondary keybinds** are supported, so you can have a primary and a backup binding for any action.
- **UI Controls** are now synced with player movement controls so if you rebind player movement on keyboard those bindings will also work for navigating menus.

## What's next

This was a lot of work for us and represents a much bigger step towards having a full vertical slice of gameplay. We're going to take a small break after this to work on a jam but after that we're going to start pushing into new areas to start fleshing out what the full game will look like!

If you haven't already, [the demo is on Steam](https://store.steampowered.com/app/2626080/Corvian_Curse/). Wishlists and plays are greatly appreciated! Also join us on [Discord](https://discord.gg/xsq2Fy2qRT) and share your feedback and daily results!
