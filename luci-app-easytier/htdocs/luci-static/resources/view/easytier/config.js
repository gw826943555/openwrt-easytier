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
		o.rmempty = false;

		o = s.option(form.Value, 'machine', _('Machine ID'),
			_('Leave empty to obtain machine ID from system'));
		o.depends('console', '1');

		o = s.option(form.Value, 'network', _('Network name'),
			_('Used to identify this VPN network'));
		o.depends('console', '0');
		o.optional = false;
		o.rmempty = false;

		o = s.option(form.Value, 'secret', _('Network secret'),
			_('Used to verify that this node belongs to the VPN network'));
		o.depends('console', '0');
		o.password = true;

		o = s.option(form.Flag, 'dhcp', _('DHCP'),
			_('Automatically assign virtual IP, default allocation is 10.126.126.0/24 network segment.'));
		o.depends('console', '0');

		o = s.option(form.Value, 'ipv4', _('IPv4 address'),
			_('IPv4 network segment of this network.'));
		o.depends('console', '0');
		o.datatype = 'ip4addr';
		o.placeholder = '10.126.126.0/24';

		o = s.option(form.DynamicList, 'peers', _('Peer nodes'),
				_('When you don\'t have a public IP, you can use the free shared nodes provided by the EasyTier community for quick networking.'));
		o.depends('console', '0');
		o.value = 'tcp://public.easytier.cn:11010'
		o.placeholder = 'tcp://example.cn:11010';

		o = s.option(form.Value, 'hostname', _('Hostname'),
			_('Hostname used to identify this device.'));
		o.depends('console', '0');

		o = s.option(form.Value, 'device', _('TUN device name'),
			_('Optional TUN interface name.'));
		o.depends('console', '0');
		o.placeholder = 'easytier';

		return m.render();
	}
});