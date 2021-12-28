<a href="">
     <img alt="Active" src="https://img.shields.io/badge/status-early%20development-orange?">
   </a>
   <a href="https://github.com/kjpou1/token-auth-server/stargazers">
     <img alt="GitHub stars" src="https://img.shields.io/github/stars/kjpou1/token-auth-server">
   </a>
   <a href="">
     <img alt="GitHub license" src="https://img.shields.io/github/license/kjpou1/token-auth-server" />
   </a>
   <a href="https://deno.land">
     <img src="https://img.shields.io/badge/deno-1.17.0-green?logo=deno"/>
   </a>

</div>

---

# Token Authentication Server

## Quickstart

1. Use the [Drake](https://github.com/srackham/drake) task runner module to
   build and test auth server library modules and CLIs for Deno.

       deno run -A Drakefile.ts <Task>

| Task            | Description                          |
| --------------- | ------------------------------------ |
| start           | Run API                              |
| denon           | Run API via denon for development    |
| mongodb         | Start mongodb server for development |
| mongodb-stop    | Stop mongodb server for development  |
| cache           | Cache and lock dependencies          |
| denon-install   | Install denon for development        |
| mongodb-install | Install mongodb for development      |

## mongodb

### Install using Brew –

Reference :
https://www.knowledgehut.com/blog/web-development/install-mongodb-mac

Homebrew helps in installing and managing applications on MacOS. If you haven't
downloaded or installed Homebrew, then click the link
(https://github.com/mongodb/homebrew-brew) to download the official Homebrew
formula for MongoDB, by running the command in your macOS Terminal:

```
brew update 
brew tap mongodb/brew
iMac-Pro-2:auth-server Jimmy$ brew install mongodb-community@5.0
```

```
iMac-Pro-2:auth-server Jimmy$ brew install mongodb-community@5.0 ==> Downloading
https://fastdl.mongodb.org/tools/db/mongodb-database-tools-macos-x86_64-100.5.1.zip
######################################################################## 100.0%
==> Downloading https://ghcr.io/v2/homebrew/core/macos-term-size/manifests/1.0.0
######################################################################## 100.0%
==> Downloading
https://ghcr.io/v2/homebrew/core/macos-term-size/blobs/sha256:c9171245cbf3ba0231147e961ae6cb2
==> Downloading from
https://pkg-containers.githubusercontent.com/ghcr1/blobs/sha256:c9171245cbf3ba0231147e96
######################################################################## 100.0%
==> Downloading https://ghcr.io/v2/homebrew/core/node/14/manifests/14.18.2
######################################################################## 100.0%
==> Downloading
https://ghcr.io/v2/homebrew/core/node/14/blobs/sha256:103fd4f0e7597f1863dc94693baad9f0d5ea38c
==> Downloading from
https://pkg-containers.githubusercontent.com/ghcr1/blobs/sha256:103fd4f0e7597f1863dc9469
######################################################################## 100.0%
==> Downloading https://ghcr.io/v2/homebrew/core/mongosh/manifests/1.1.6
######################################################################## 100.0%
==> Downloading
https://ghcr.io/v2/homebrew/core/mongosh/blobs/sha256:ab9347d2a7eb6132f8d9171e65d3e0e2cf14cf6
==> Downloading from
https://pkg-containers.githubusercontent.com/ghcr1/blobs/sha256:ab9347d2a7eb6132f8d9171e
######################################################################## 100.0%
==> Downloading https://fastdl.mongodb.org/osx/mongodb-macos-x86_64-5.0.4.tgz
######################################################################## 100.0%
==> Installing mongodb-community from mongodb/brew Error: Your Command Line
Tools are too outdated. Update them from Software Update in System Preferences
or run: softwareupdate --all --install --force

If that doesn't show you any updates, run: sudo rm -rf
/Library/Developer/CommandLineTools sudo xcode-select --install

Alternatively, manually download them from:
https://developer.apple.com/download/all/. You should download the Command Line
Tools for Xcode 13.1.
```

#### Install tools because of Monterey

```
iMac-Pro-2:auth-server Jimmy$ softwareupdate --all --install --force Software
Update Tool

Finding available software Downloading macOS Monterey 12.1 Downloading: 23.32%
```

## Create database data path

```
iMac-Pro-2:auth-server Jimmy$ sudo mkdir -p /data/db iMac-Pro-2:auth-server
Jimmy$ sudo chown -R `id -un` /data/db
```

## Common error HTTP status codes include [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status):

- 400 Bad Request – This means that client-side input fails validation.
- 401 Unauthorized – This means the user isn’t not authorized to access a
  resource. It usually returns when the user isn’t authenticated.
- 403 Forbidden – This means the user is authenticated, but it’s not allowed to
  access a resource.
- 404 Not Found – This indicates that a resource is not found.
- 500 Internal server error – This is a generic server error. It probably
  shouldn’t be thrown explicitly.
- 502
  [Bad Gateway](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502) –
  This indicates an invalid response from an upstream server.
- 503 Service Unavailable – This indicates that something unexpected happened on
  server side (It can be anything like server overload, some parts of the system
  failed, etc.).

### Forbidden, Unauthorized, or What Else?

[Forbidden, Unauthorized, or What Else?](https://auth0.com/blog/forbidden-unauthorized-http-status-codes/)

## Best practices

- [Best practices for REST API design](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/#h-accept-and-respond-with-json)
- [RESTful web API design](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design)

## HATEOAS

[Use HATEOAS to enable navigation to related resources](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design#use-hateoas-to-enable-navigation-to-related-resources)

## --unstable flag

The unstable flag is needed now for using the
[bcrypt library](https://github.com/JamesBroadberry/deno-bcrypt/issues/24)
Review this once there is a new release.

## Style Guide ✨

https://github.com/basarat/typescript-book/blob/master/docs/styleguide/styleguide.md

## JWT Handling

[The Ultimate Guide to handling JWTs on frontend
clients](https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/#silent_refresh)

[The Ultimate Guide to JWT server-side auth (with refresh tokens)](https://katifrantz.com/the-ultimate-guide-to-jwt-server-side-authentication-with-refresh-tokens)

[OAuth 2.0 for Browser-Based Apps](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps#section-8)

[What Are Refresh Tokens and How to Use Them Securely](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/)

## CSRF

https://deno.land/x/drash_middleware@v0.7.10/csrf
https://en.wikipedia.org/wiki/Cross-site_request_forgery
https://github.com/Octo8080/deno-csrf

## Running from dockerfile

```
cd api
docker build -t token-auth-server . && docker run -it --init -p 3001:3001 -e MONGO_URL=ngodb://192.168.178.223:27017 token-auth-server
```

## Docker compose commands

Rebuild

```
docker-compose down && docker-compose build
```

Start the compose containers

```
docker-compose up
```
