Coming up soon at `$job` we're going to start deploying some Rust code to production. One of the really nice things about developing Rust code is the included package manager, `cargo`, and all of the crates available at [crates.io](https://crates.io/). One especially nice feature of crates.io, compared to other package repositories I have experience with, is the fact that they will never allow a user to overwrite or delete a version of published code<sup>[1]</sup>. They do support an action called `yank`<sup>[2]</sup> which allows you do prevent new projects from depending on a version but it will still be available to projects that have a Cargo.lock. This is great because I have much less to worry about in regard to repeatable builds when using cargo with crates.io.

Unfortunately we're not going to want to rely on crates.io being up to push code to production. While crates.io has been mostly stable I can't rely on that stability when I need to push an emergency bug fix. Also, I might have development and/or build servers that don't have access to the internet to begin with. With other languages I'd just throw up a caching mirror and point my package manager at that. Rust, however, is still pretty young and I wasn't able to find anything in regard to mirroring crates.io other than a single issue<sup>[3]</sup> on GitHub. With that I set out to learn more about how cargo and crates.io interact and what it would take to setup a bare minimum mirror.

## Index

The first thing I need to do is figure out how to point cargo at my "mirror" but I don't even know what protocol cargo speaks. In the issue I mentioned above it was stated that you'd need to clone the official index<sup>[4]</sup> to create a mirror. Hmm, this is just a repo on GitHub but doesn't contain the actual packages.

```shell

```

## Resources

1. http://doc.crates.io/crates-io.html#publishing-crates
2. http://doc.crates.io/crates-io.html#cargo-yank
3. https://github.com/rust-lang/crates.io/issues/67
4. https://github.com/rust-lang/crates.io-index


* https://github.com/rust-lang/cargo
* https://github.com/rust-lang/crates.io
* https://github.com/rust-lang/cargo/blob/master/src/cargo/sources/registry.rs

