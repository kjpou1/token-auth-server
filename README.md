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
     <img src="https://img.shields.io/badge/deno-1.17.1-green?logo=deno"/>
   </a>

</div>

---

# Token Authentication Server

## Pre Requirements
---

[Docker Compose](https://docs.docker.com/compose/install/) is used to execute the project and is described below.  [Docker Desktop](https://docs.docker.com/desktop/) includes [Compose](https://docs.docker.com/compose/install/) along with other Docker apps, so most users do not need to install Compose separately. 

- ### Docker Desktop

  - [Install Docker Desktop on Mac](https://docs.docker.com/desktop/mac/install/)

  - [Install Docker Desktop on Windows](https://docs.docker.com/desktop/windows/install/)

- ### Clone this repository:

  ```
  $ git clone https://github.com/kjpou1/token-auth-server.git

  $ cd token-auth-server
  ```

- ### Minimal Configuration:
  Setup the default user seed information for api:

  - First create the `.env` file

    - Mac 
      ```
      $ cd api
      $ touch .env
      ```

    - Windows
      ```
      cd api
      copy .env+
      ```
  - Open and add the following configuration entries:

    ``` bash
    #===========================
    ## Database seed information
    #===========================

    # The default name of the user
    SEED_NAME=Admin
    # The default email of the user
    SEED_EMAIL=admin@example.com
    # The default password of the seeded user
    SEED_PASSWORD=
    ```
    :exclamation: <b><i>Note:</i> Make sure to provide a SEED_PASSWORD value or an error will be issued during startup</b> 




## Quickstart - Running locally
---

Start up the [docker compose](https://docs.docker.com/compose/install/)file provided in the main directory.

- ### Run interactively
  ```
  docker compose up --build
  ```

- ### Run in background task
  ```
  docker compose up -d --build
  ```

This may take a while on first run while everything is being downloaded, built and installed.
