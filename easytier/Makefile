include $(TOPDIR)/rules.mk

PKG_NAME:=easytier
PKG_VERSION:=2.4.5
PKG_RELEASE:=1

PKG_SOURCE_PROTO:=git
PKG_SOURCE_URL:=https://github.com/EasyTier/EasyTier.git
PKG_MIRROR_HASH:=b3bc4d97fb5179303aa898867edb11427f2ebce916b52b5458e897ede9e9fc4b
PKG_SOURCE_VERSION:=c0d2045e52f485737191c404574182bb7f38f609
PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)-$(PKG_VERSION)

PKG_MAINTAINER:=William
PKG_LICENSE:=LGPL-3.0-only

PKG_BUILD_DEPENDS:=rust/host
PKG_BUILD_PARALLEL:=1

include $(INCLUDE_DIR)/package.mk
include $(TOPDIR)/feeds/packages/lang/rust/rust-package.mk

define Package/easytier
  SECTION:=net
  CATEGORY:=Network
  SUBMENU:=VPN
  TITLE:=A simple, secure, decentralized networking solution
  URL:=https://easytier.cn
  DEPENDS:=+kmod-tun
  PKGARCH:=all
endef

define Package/easytier/description
  A simple, secure, decentralized virtual private network solution powered by Rust and Tokio.
  
  Features:
  - Decentralized: Nodes are equal and independent, no centralized services required
  - Easy to Use: Multiple operation methods via web, client, and command line
  - Cross-Platform: Supports Win/MacOS/Linux/FreeBSD/Android and X86/ARM/MIPS architectures
  - Secure: AES-GCM or WireGuard encryption, prevents man-in-the-middle attacks
endef

define Package/easytier/conffiles
/etc/config/easytier
endef

# Rust build configuration
RUST_PKG_FEATURES:=

define Build/Compile
	$(call Build/Compile/Cargo,easytier,$(RUST_PKG_FEATURES))
endef

define Package/easytier/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(PKG_INSTALL_DIR)/bin/easytier* $(1)/usr/bin/
	
	$(INSTALL_DIR) $(1)/etc/config
	$(INSTALL_CONF) ./files/easytier.config $(1)/etc/config/easytier
	
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./files/easytier.init $(1)/etc/init.d/easytier
endef

$(eval $(call BuildPackage,easytier))
