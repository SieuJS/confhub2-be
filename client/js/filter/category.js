$(document).ready(function() {
    $.ajax({
        url: '/api/v1/categories', // Replace with your server URL
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            var $select = $('#master-category');
            $select.empty(); // Clear existing options
            $select.append('<option value="">Category</option>'); // Add default option

            $.each(data, function(index, category) {
                $select.append('<option value="' + category.id + '">' + category.name + '</option>');
            });
        },
        error: function(xhr, status, error) {
            console.error('Error fetching categories:', error);
        }
    });
});