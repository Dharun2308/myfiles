'use strict';'require fs';'require rpc';'require uci';'require view';'require form';'require tools.widgets as widgets';return view.extend({handleGetHelpText:function(script_name,tbl){return fs.read("/usr/lib/sqm/"+script_name+".help").then(function(text){if(text)
return[script_name,text];});},handleEnableSQM:rpc.declare({object:'luci',method:'setInitAction',params:['sqm','enable'],expect:{result:false}}),load:function(){return Promise.all([fs.list("/var/run/sqm/available_qdiscs"),fs.list("/usr/lib/sqm").then(L.bind(function(scripts){var tasks=[],scriptHelpTbl={};for(var i=0;i<scripts.length;i++)
if(scripts[i].name.search(/\.qos$/)!=-1)
tasks.push(L.resolveDefault(this.handleGetHelpText(scripts[i].name,scriptHelpTbl),[scripts[i].name,null]));return Promise.all(tasks);},this)),uci.load('sqm')]);},render:function(data){var qdiscs=data[0],scripts=data[1];var m,s,o;m=new form.Map('sqm',_('Smart Queue Management'));m.description=_("");s=m.section(form.TypedSection,'queue',_('Queues'));s.tab("tab_basic",_("Basic Settings"));s.tab("tab_qdisc",_("Queue Discipline"));s.tab("tab_linklayer",_("Link Layer Adaptation"));s.anonymous=true;s.addremove=true;o=s.taboption("tab_basic",form.Flag,"enabled",_("Enable this SQM "));o.rmempty=false;o.write=L.bind(function(section,value){if(value=="1"){this.handleEnableSQM();L.ui.addNotification(null,E('p',_("The SQM GUI has just enabled the sqm initscript on your behalf. Remember to disable the sqm initscript manually under System Startup menu in case this change was not wished for.")));}
return uci.set("sqm",section,"enabled",value);},this);o=s.taboption("tab_basic",widgets.DeviceSelect,"interface",_("Interface name"));o.rmempty=false;o=s.taboption("tab_basic",form.Value,"download",_("Download speed (kbit/s)"));o.datatype="and(uinteger,min(0))";o.rmempty=false;o=s.taboption("tab_basic",form.Value,"upload",_("Upload speed (kbit/s) "));o.datatype="and(uinteger,min(0))";o.rmempty=false;o=s.taboption("tab_basic",form.Flag,"debug_logging",_("Create log file "));o.rmempty=false;o=s.taboption("tab_basic",form.ListValue,"verbosity",_("SQM's output into the system log."));o.value("0","silent");o.value("1","error");o.value("2","warning");o.value("5","info ("+_("default")+")");o.value("8","debug");o.value("10","trace");o.default="5";o=s.taboption("tab_qdisc",form.ListValue,"qdisc",_("Queuing discipline: "));for(var i=0;i<qdiscs.length;i++){o.value(qdiscs[i].name);}
o.default="cake";o.rmempty=false;var qos_desc="";o=s.taboption("tab_qdisc",form.ListValue,"script",_("Queue setup script"));for(i=0;i<scripts.length;i++){o.value(scripts[i][0]);qos_desc+="<p><b>"+scripts[i][0]+":</b><br />";if(scripts[i][1])
qos_desc+=scripts[i][1]+"</p>";else
qos_desc+="No help text</p>";}
o.default="piece_of_cake.qos";o.rmempty=false;o.description=qos_desc;o=s.taboption("tab_qdisc",form.Flag,"qdisc_advanced",_("Show and Use Advanced Configuration"));o.default=false;o=s.taboption("tab_qdisc",form.ListValue,"squash_dscp",_("Squash DSCP on inbound packets (ingress):"));o.value("1","SQUASH");o.value("0","DO NOT SQUASH");o.default="1";o.depends("qdisc_advanced","1");o=s.taboption("tab_qdisc",form.ListValue,"squash_ingress",_("Ignore DSCP on ingress:"));o.value("1","Ignore");o.value("0","Allow");o.default="1";o.depends("qdisc_advanced","1");o=s.taboption("tab_qdisc",form.ListValue,"ingress_ecn",_("Explicit congestion notification (ECN) status on inbound packets (ingress):"));o.value("ECN","ECN ("+_("default")+")");o.value("NOECN");o.default="ECN";o.depends("qdisc_advanced","1");o=s.taboption("tab_qdisc",form.ListValue,"egress_ecn",_("Explicit congestion notification (ECN) status on outbound packets (egress)."));o.value("NOECN","NOECN ("+_("default")+")");o.value("ECN");o.default="NOECN";o.depends("qdisc_advanced","1");o=s.taboption("tab_qdisc",form.Flag,"qdisc_really_really_advanced",_("Show and Use Dangerous Configuration. Dangerous options will only be used as long as this box is checked."));o.default=false
o.depends("qdisc_advanced","1");o=s.taboption("tab_qdisc",form.Value,"ilimit",_("Hard limit on ingress queues; leave empty for default."));o.datatype="and(uinteger,min(0))";o.depends("qdisc_really_really_advanced","1");o=s.taboption("tab_qdisc",form.Value,"elimit",_("Hard limit on egress queues; leave empty for default."));o.datatype="and(uinteger,min(0))";o.depends("qdisc_really_really_advanced","1");o=s.taboption("tab_qdisc",form.Value,"itarget",_("Latency target for ingress, e.g 5ms [units: s, ms, or  us]; leave empty for automatic selection, put in the word default for the qdisc's default."));o.datatype="string";o.depends("qdisc_really_really_advanced","1");o=s.taboption("tab_qdisc",form.Value,"etarget",_("Latency target for egress, e.g. 5ms [units: s, ms, or  us]; leave empty for automatic selection, put in the word default for the qdisc's default."));o.datatype="string";o.depends("qdisc_really_really_advanced","1");o=s.taboption("tab_qdisc",form.Value,"iqdisc_opts",_("Advanced option string to pass to the ingress queueing disciplines; no error checking, use very carefully."));o.depends("qdisc_really_really_advanced","1");o=s.taboption("tab_qdisc",form.Value,"eqdisc_opts",_("Advanced option string to pass to the egress queueing disciplines; no error checking, use very carefully."));o.depends("qdisc_really_really_advanced","1");o=s.taboption("tab_linklayer",form.ListValue,"linklayer",_("Which link layer to account for:"));o.value("none","none ("+_("default")+")");o.value("ethernet","Ethernet with overhead: select for e.g. VDSL2.");o.value("atm","ATM: select for e.g. ADSL1, ADSL2, ADSL2+.");o.default="none";o=s.taboption("tab_linklayer",form.Value,"overhead",_("Per Packet Overhead (byte):"));o.datatype="and(integer,min(-1500))";o.default=0
o.depends("linklayer","ethernet");o.depends("linklayer","atm");o=s.taboption("tab_linklayer",form.Flag,"linklayer_advanced",_("Show Advanced Linklayer Options, (only needed if MTU > 1500). Advanced options will only be used as long as this box is checked."));o.depends("linklayer","ethernet");o.depends("linklayer","atm");o=s.taboption("tab_linklayer",form.Value,"tcMTU",_("Maximal Size for size and rate calculations, tcMTU (byte); needs to be >= interface MTU + overhead:"));o.datatype="and(uinteger,min(0))";o.default=2047
o.depends("linklayer_advanced","1");o=s.taboption("tab_linklayer",form.Value,"tcTSIZE",_("Number of entries in size/rate tables, TSIZE; for ATM choose TSIZE = (tcMTU + 1) / 16:"));o.datatype="and(uinteger,min(0))";o.default=128
o.depends("linklayer_advanced","1");o=s.taboption("tab_linklayer",form.Value,"tcMPU",_("Minimal packet size, MPU (byte); needs to be > 0 for ethernet size tables:"));o.datatype="and(uinteger,min(0))";o.default=0
o.depends("linklayer_advanced","1");o=s.taboption("tab_linklayer",form.ListValue,"linklayer_adaptation_mechanism",_("Which linklayer adaptation mechanism to use; for testing only"));o.value("default","default ("+_("default")+")");o.value("cake");o.value("htb_private");o.value("tc_stab");o.default="default";o.depends("linklayer_advanced","1");return m.render();}})