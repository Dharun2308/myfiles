#!/bin/bash

# Install all dependencies
sudo apt update -y

sudo apt install -y build-essential ccache ecj fastjar file g++ gawk \
gettext git java-propose-classpath libelf-dev libncurses5-dev \
libncursesw5-dev libssl-dev python python2.7-dev python3 unzip wget \
python3-distutils python3-setuptools rsync subversion swig time \
xsltproc zlib1g-dev

sudo apt install -y quilt qemu qemu-utils qemu-kvm virt-manager libvirt-daemon-system libvirt-clients bridge-utils busybox curl rsync build-essential asciidoc binutils bzip2 gawk gettext git libncurses5-dev libz-dev patch unzip zlib1g-dev lib32gcc1 libc6-dev-i386 subversion flex uglifyjs git-core gcc-multilib p7zip p7zip-full msmtp libssl-dev texinfo libglib2.0-dev xmlto qemu-utils upx libelf-dev autoconf automake libtool autopoint device-tree-compiler wget
 
sudo apt-get -y install gcc-multilib g++-multilib 

sudo apt update -y

sudo apt upgrade -y

clear

# Clone the source code

git clone https://git.openwrt.org/openwrt/openwrt.git
cd openwrt
git checkout v21.02.1

# custom files download
svn checkout https://github.com/Dharun2308/myfiles/trunk/custom_files/RPI/files

# .config file
rm .config
wget -L https://raw.githubusercontent.com/Dharun2308/myfiles/main/menu_config_files/RPI/v2/.config

# MPTCP patch file download and move to correct location:
wget -L https://raw.githubusercontent.com/Dharun2308/myfiles/main/patch_files/openwrt_v21.02.1_kernel_5.4/v2/999-mptcp_v0.96.patch
mv 999-mptcp_v0.96.patch target/linux/generic/hack-5.4/999-mptcp_v0.96.patch

# Download kernel config file
wget -L https://raw.githubusercontent.com/Dharun2308/myfiles/main/kernel_config_file/RPI4/config-5.4
mv config-5.4 target/linux/bcm27xx/bcm2711/config-5.4

# Remove old and download latest feeds.conf.default
rm feeds.conf.default
wget -L https://raw.githubusercontent.com/Dharun2308/myfiles/main/feeds.conf.default/feeds.conf.default

./scripts/feeds clean

./scripts/feeds update -a

./scripts/feeds install -a

make -j $(($(nproc)+1)) menuconfig 

# Test the patches to see if they're applied fine

make target/linux/{clean,prepare} V=s

clear 

make -j $(($(nproc)+1)) kernel_menuconfig

# Finally make the image

make download

make -j $(($(nproc)+1)) 






