# darkanakin41/online-dns-update

This code is made to auto update DNS entries defined in [config.ts](./app/src/config.dist.ts).

You can run it both manually or using a docker container.

At the moment, it can only manage [Scaleway Dedibox](https://www.scaleway.com/en/dedibox/) DNS but I will add some in the future if needed.

## TODO 
* [ ] Find a better way of managing config
* [ ] Manage multiple DNS provider
* [ ] Manage multiple DNS provider in one execution