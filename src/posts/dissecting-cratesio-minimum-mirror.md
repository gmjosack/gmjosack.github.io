Recently at `$job` I spent a Hackweek making Rust ready for production deployments. Part of that was figuring out what builds were going to look like. One of the really nice things about developing Rust code is the included package manager, `cargo`, and all of the crates available at [crates.io](https://crates.io/). One especially nice feature of crates.io, compared to other package repositories I have experience with, is the fact that they will never allow a user to overwrite or delete a version of published code[^1]. They do support an action called `yank`[^2] which allows you do prevent new projects from depending on a version but it will still be available to projects that have a `Cargo.lock`. This is great because I have much less to worry about in regard to repeatable builds when using cargo with crates.io.

Unfortunately we're not going to want to rely on crates.io being up to push code to production. While crates.io has been mostly stable there have been a few issues with DNS resolution in the past and I can't rely on that stability when I need to push an emergency bug fix. Also, I might have development and/or build servers that don't have access to the internet to begin with. With other languages I'd just throw up a caching mirror and point my package manager at that. Rust, however, is still pretty young and I wasn't able to find anything in regard to mirroring crates.io other than a single issue[^3] on GitHub. With that I set out to learn more about how cargo and crates.io interact and what it would take to setup a bare minimum mirror.

## Index

The first thing I need to do is figure out how to point cargo at my "mirror" but I don't even know what protocol cargo speaks. The docs on crates.io mention updating the `index` attribute under the `[registry]` section of your `.cargo/config` but it doesn't give an example url or describe what is expected. In the issue I mentioned above it was stated that you'd need to clone the official index[^4] to create a mirror. Browsing through the cargo source[^5] also confirms that this expects a git repository. Navigating over to the repo and right away you'll notice at the top level there are a lot of two letter directories, directories for 1, 2, and 3 letter packages, and a `config.json`. This is a fairly common strategy to keep the number of files in a directory limited. I'd elaborate more on the layout but there's a fantastic doc comment[^6] in the cargo repo that you can refer to.

An example of a file for the `sysconf` crate, found under `sy/sc/sysconf`, looks as follows:

```json
{
    "name": "sysconf",
    "vers": "0.1.0",
    "deps": [
        {
            "name": "libc",
            "req": "*",
            "features": [""],
            "optional": false,
            "default_features": true,
            "target": null,
            "kind": "normal"
        }
    ],
    "cksum": "be72e7128262fbd8dcb2e3eecee6135ed1611e0a9d63feca600b4a19f297eb49",
    "features": {},
    "yanked": false
}
```
This translates pretty directly to the options available to you in a `Cargo.toml` file. These files don't appear to be themselves valid json documents but a newline delimited list of json documents, one line/document per version. Since it's obvious no package data itself is going to be located here I decided to take a look at the `config.json` file next.

## Downloading Packages

Jumping into the file you can see it's pretty basic.

```json
{
  "dl": "https://crates.io/api/v1/crates",
  "api": "https://crates.io/"
}
```

I could dig through more code real quick but my hunch is that I only need to provide `dl` for a basic mirror. I cloned the mirror, pointed my `.cargo/config` at it, and checked in the following as my new `config.json`.


```json
{
  "dl": "http://localhost:8080/api/v1/crates",
  "api": "http://localhost:8080/"
}
```

I threw up a mitmproxy just to watch the traffic flow through and ran a few `cargo` commands.


```console
 $ mitmproxy -b localhost -p 8080 -R http2https://crates.io/ --setheader="/~q/Host/crates.io"
```

At first I wasn't seeing anything come through but I realized that cargo will do a decent amount of caching of package downloads. Once I purged out the cache data from `~/.multirust/toolchains/beta/cargo/registry`, (`~/.cargo/registry` if you don't use `multirust`) I was able to see the traffic flow through the proxy. For the example I was able to confirm that only the download url was being used at all. This means mirroring should be pretty simple since I don't have to provide a bunch of fancy APIs.

With that information I should have enough information to throw together the worlds most basic mirror.

## Bare Minimum Mirror

At this point I'm going to get out of the way and let the commands speak for themselves. I'm going to create a new project with a single simple dependency that uses a custom index and download url. Let's start backwards.

### File Server

```console
gary@pixel:~/mirror$ mkdir fileserver
gary@pixel:~/mirror$ cd fileserver/
gary@pixel:~/mirror/fileserver$ dl_path="api/v1/crates/libc/0.1.10"
gary@pixel:~/mirror/fileserver$ mkdir -p "$dl_path"
gary@pixel:~/mirror/fileserver$ wget -o /dev/null -O $dl_path/download https://crates.io/$dl_path/download
gary@pixel:~/mirror/fileserver$ tree
.
└── api
    └── v1
        └── crates
            └── libc
                └── 0.1.10
                    └── download

5 directories, 1 file
gary@pixel:~/mirror/fileserver$ python -m SimpleHTTPServer 8080
Serving HTTP on 0.0.0.0 port 8080 ...

```

### Index

```console
gary@pixel:~/mirror$ git clone git@github.com:rust-lang/crates.io-index.git
Cloning into 'crates.io-index'...
remote: Counting objects: 75586, done.
remote: Compressing objects: 100% (137/137), done.
remote: Total 75586 (delta 67), reused 0 (delta 0), pack-reused 75441
Receiving objects: 100% (75586/75586), 9.73 MiB | 2.26 MiB/s, done.
Resolving deltas: 100% (41211/41211), done.
Checking connectivity... done.
gary@pixel:~/mirror$ cd crates.io-index/
gary@pixel:~/mirror/crates.io-index$ cat << EOF > config.json
> {
>   "dl": "http://localhost:8080/api/v1/crates",
>   "api": "http://localhost:8080/"
> }
> EOF
gary@pixel:~/mirror/crates.io-index$ git commit -a -m "Point at local fileserver"
[master 3089a25] Point at local fileserver
 1 file changed, 2 insertions(+), 2 deletions(-)
```

### Project

```console
gary@pixel:~/mirror$ cargo new --bin use-mirror
gary@pixel:~/mirror$ cd use-mirror/
gary@pixel:~/mirror/use-mirror$ mkdir .cargo
gary@pixel:~/mirror/use-mirror$ cat << EOF > .cargo/config
> [registry]
> index = "file:///home/gary/mirror/crates.io-index"
> EOF
gary@pixel:~/mirror/use-mirror$ cat << EOF >> Cargo.toml
> [dependencies]
> libc = "0.1.10"
> EOF
gary@pixel:~/mirror/use-mirror$ cargo build
    Updating registry `file:///home/gary/mirror/crates.io-index`
 Downloading libc v0.1.10 (registry file:///home/gary/mirror/crates.io-index)
   Compiling libc v0.1.10 (registry file:///home/gary/mirror/crates.io-index)
   Compiling use-mirror v0.1.0 (file:///home/gary/mirror/use-mirror)
```

and back over in the fileserver terminal

```console
localhost - - [23/Aug/2015 23:16:24] "GET /api/v1/crates/libc/0.1.10/download HTTP/1.1" 200 -
```

## Conclusion

As you can see it's actually not much work at all to setup a simple mirror. One pain point that I had to tackle was keeping the index up to date while I have a local commit. For now I'm using fancy git merge strategies to deal with potential future changes to `config.json` but I'd love to see better support worked out here over time that didn't require such hacks.


[^1]: http://doc.crates.io/crates-io.html#publishing-crates
[^2]: http://doc.crates.io/crates-io.html#cargo-yank
[^3]: https://github.com/rust-lang/crates.io/issues/67
[^4]: https://github.com/rust-lang/crates.io-index
[^5]: https://github.com/rust-lang/cargo/blob/d87ac45/src/cargo/sources/registry.rs#L181
[^6]: https://github.com/rust-lang/cargo/blob/d87ac45/src/cargo/sources/registry.rs#L52-L100
