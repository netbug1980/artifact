function Role(){
	
}
Role.selectModal = function(){
	var compile = require('../handlebars/role-modal.handlebars');
	var tpl = compile();
	$("#singleModal .modal-content").html(tpl);
	$("#singleModal").modal("show");
};

module.exports = Role;