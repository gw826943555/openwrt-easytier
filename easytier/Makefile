include $(TOPDIR)/rules.mk

PKG_NAME:=easytier
PKG_VERSION:=2.4.3
PKG_RELEASE:=1

PKG_SOURCE_PROTO:=git
PKG_SOURCE_URL:=https://github.com/EasyTier/EasyTier.git
PKG_MIRROR_HASH:=09b75f6b4167e4eddc18e0484fa9b9fecdebcb65a8c22ec9a118a348152bad5e
PKG_SOURCE_VERSION:=719a1fe7cf88e66893f0fcead4a559789023b82e
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
	$(call Build/Compile/Cargo,,$(RUST_PKG_FEATURES))
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