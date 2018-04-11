//== Class definition

var BootstrapSelect = function () {

    //== Private functions
    var selects = function () {
        // minimum setup
        $('.m-bootstrap-select').selectpicker();
    }

    return {
        // public functions
        init: function () {
            selects();
        }
    };
}();

jQuery(document).ready(function () {
    BootstrapSelect.init();
});
