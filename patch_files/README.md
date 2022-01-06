# MPTCP Patch files

Official out-of-tree MPTCP patches only support minor releases of the Linux kernel (starting with 4.9). OpenWrt uses patch releases of that Linux kernel. Because of this reason, you can't use the patches from the official website.

The patch should be in the following location : 
```ruby 
target/linux/generic/hack-5.4/999-mptcp_v0.96.patch
```
After downloading the patch run the following command to apply and check if the patches are fine.
```ruby 
make target/linux/{clean,prepare} V=s
```

# mptcpv0 patches for openwrt v19.07.8 kernel version 4.14

Download from : https://github.com/arinc9/openwrt/blob/openwrt-19.07-mptcpv0/target/linux/generic/hack-4.14/999-mptcp_v0.94.patch

```ruby 
curl 'https://raw.githubusercontent.com/arinc9/openwrt/openwrt-19.07-mptcpv0/target/linux/generic/hack-4.14/999-mptcp_v0.94.patch' -o target/linux/generic/hack-4.14/999-mptcp_v0.94.patch
```

### V1 (Nov 2021 released )

MPTCP patch version 1 from arinc9 of openwrt forum. Works on openwrt version 21.02.1. 

#### Features
* MPTCP path-manager control
* MPTCP advanced scheduler control


# mptcpv0 patches for openwrt v21.02.1 kernel version 5.4

### V1 (Nov 2021 released )

MPTCP patch version 1 from arinc9 of openwrt forum. Works on openwrt version 21.02.1. 

#### Features
* MPTCP path-manager control
* MPTCP advanced scheduler control


### V2 (Jan 2022 release)

MPTCP patch version 2 from arinc9 of openwrt forum. Works on openwrt version 21.02.1. Some additional features apart from V1 patch file

#### Features
* MPTCP path-manager control
* MPTCP advanced scheduler control
* TCP congestion control

```ruby
wget -L https://raw.githubusercontent.com/Dharun2308/myfiles/main/patch_files/openwrt_v21.02.1_kernel_5.4/v2/999-mptcp_v0.96.patch
```
