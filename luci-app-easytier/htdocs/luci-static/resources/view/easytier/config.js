/* SPDX-License-Identifier: LGPL-3.0-only
 *
 * Copyright (c) 2025 William Guo <github.com/gw826943555>
 *
 */

'use strict';
'require form';
'require poll';
'require rpc';
'require uci';
'require view';
'require tools.widgets as widgets';

const callServiceList = rpc.declare({
	object: 'service',
	method: 'list',
	params: ['name'],
	expect: { '': {} }
});

function getServiceStatus() {
	return L.resolveDefault(callServiceList('easytier'), {}).then(function(res) {
		let isRunning = false;
		try {
			isRunning = res['easytier']['instances']['instance1']['running'];
		} catch (e) { }
		return isRunning;
	});
}

function renderStatus(isRunning) {
	let spanTemp = '<em><span style="color:%s"><strong>%s %s</strong></span></em>';
	let renderHTML;
	if (isRunning)
		renderHTML = String.format(spanTemp, 'green', _('EasyTier'), _('RUNNING'));
	else
		renderHTML = String.format(spanTemp, 'red', _('EasyTier'), _('NOT RUNNING'));

	return renderHTML;
}

return view.extend({
	render: function() {
		let m, s, o;

		m = new form.Map('easytier', _('EasyTier'),
			_('A simple, secure, decentralized networking solution.'));

		s = m.section(form.TypedSection);
		s.anonymous = true;
		s.render = function() {
			poll.add(function() {
				return L.resolveDefault(getServiceStatus()).then(function(res) {
					let view = document.getElementById('service_status');
					view.innerHTML = renderStatus(res);
				});
			});

			return E('div', { class: 'cbi-section', id: 'status_bar' }, [
				E('p', { id: 'service_status' }, _('Collecting data…'))
			]);
		}

		s = m.section(form.NamedSection, 'global', 'easytier', _('Global configuration'));

		o = s.option(form.Flag, 'enabled', _('Enable'));

		o = s.option(form.Flag, 'console', _('Web Console'),
			_('Using the <a target="_blank" href="%s">Web Console</a> to manage EasyTier nodes.').format(
				'https://easytier.cn/en/guide/network/web-console.html'));

		o = s.option(form.Value, 'server', _('Configuration server address'),
			_('Full url like udp://127.0.0.1:22020/admin or username only to use official server'));
		o.depends('console', '1');
		o.optional = false;

		o = s.option(form.Value, 'machine', _('Machine ID'),
			_('Leave empty to obtain machine ID from system'));
		o.depends('console', '1');

		o = s.option(form.Value, 'port', _('Listen port'));
		o.datatype = 'port';

		o = s.option(form.Value, 'secret', _('Client secret'));
		o.password = true;

		o = s.option(form.Value, 'local_conf_path', _('Local config path'),
			_('Path of the optional file local.conf (see <a target="_blank" href="%s">documentation</a>).').format(
				'https://docs.easytier.com/config/#local-configuration-options'));
		o.value('/etc/easytier.conf');

		o = s.option(form.Value, 'config_path', _('Config path'),
				_('Persistent configuration directory (to keep other configurations such as controller or moons, etc.).'));
		o.value('/etc/easytier');

		o = s.option(form.Flag, 'copy_config_path', _('Copy config path'),
				_('Copy the contents of the persistent configuration directory to memory instead of linking it, this avoids writing to flash.'));
		o.depends({'config_path': '', '!reverse': true});

		o = s.option(form.Flag, 'fw_allow_input', _('Allow input traffic'),
			_('Allow input traffic to the EasyTier daemon.'));

		o = s.option(form.Button, '_panel', _('EasyTier Central'),
			_('Create or manage your EasyTier network, and auth clients who could access.'));
		o.inputtitle = _('Open website');
		o.inputstyle = 'apply';
		o.onclick = function() {
			window.open("https://my.easytier.com/network", '_blank');
		}

		s = m.section(form.GridSection, 'network', _('Network configuration'));
		s.addremove = true;
		s.rowcolors = true;
		s.sortable = true;
		s.nodescriptions = true;

		o = s.option(form.Flag, 'enabled', _('Enable'));
		o.default = o.enabled;
		o.editable = true;

		o = s.option(form.Value, 'id', _('Network ID'));
		o.rmempty = false;
		o.width = '20%';

		o = s.option(form.Flag, 'allow_managed', _('Allow managed IP/route'),
			_('Allow EasyTier to set IP addresses and routes (local/private ranges only).'));
		o.default = o.enabled;
		o.editable = true;

		o = s.option(form.Flag, 'allow_global', _('Allow global IP/route'),
			_('Allow EasyTier to set global/public/not-private range IPs and routes.'));
		o.editable = true;

		o = s.option(form.Flag, 'allow_default', _('Allow default route'),
			_('Allow EasyTier to set the default route on the system.'));
		o.editable = true;

		o = s.option(form.Flag, 'allow_dns', _('Allow DNS'),
			_('Allow EasyTier to set DNS servers.'));
		o.editable = true;

		o = s.option(form.Flag, 'fw_allow_input', _('Allow input'),
			_('Allow input traffic from the EasyTier network.'));
		o.editable = true;

		o = s.option(form.Flag, 'fw_allow_forward', _('Allow forward'),
			_('Allow forward traffic from/to the EasyTier network.'));
		o.editable = true;

		o = s.option(widgets.DeviceSelect, 'fw_forward_ifaces', _('Forward interfaces'),
			_('Leave empty for all.'));
		o.multiple = true;
		o.noaliases = true;
		o.depends('fw_allow_forward', '1');
		o.modalonly = true;

		o = s.option(form.Flag, 'fw_allow_masq', _('Masquerading'),
			_('Enable network address and port translation (NAT) for outbound traffic for this network.'));
		o.editable = true;

		o = s.option(widgets.DeviceSelect, 'fw_masq_ifaces', _('Masquerade interfaces'),
			_('Leave empty for all.'));
		o.multiple = true;
		o.noaliases = true;
		o.depends('fw_allow_masq', '1');
		o.modalonly = true;

		return m.render();
	}
});