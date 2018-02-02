(function( wp, AdminInterface ) {

	/**
	 * All of the code for your admin-facing JavaScript source
	 * should reside in this file.
	 */


    let displayAdminInterface = () => {
        AdminInterface.init(wp, 'reactRoot');
    }
    document.addEventListener("DOMContentLoaded", displayAdminInterface);

})( wp, AdminInterface );
