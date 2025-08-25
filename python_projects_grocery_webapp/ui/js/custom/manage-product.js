var productModal = $("#productModal");
    $(function () {
        // Load products table
        loadProductTable();
    });

    function loadProductTable() {
        $.get(productListApiUrl, function (response) {
            if(response) {
                var table = '';
                $.each(response, function(index, product) {
                    table += '<tr data-id="'+ product.product_id +'" data-name="'+ product.name +'" data-unit="'+ product.uom_id +'" data-price="'+ product.price_per_unit +'">' +
                        '<td>'+ product.name +'</td>'+
                        '<td>'+ product.uom_name +'</td>'+
                        '<td>'+ product.price_per_unit +'</td>'+
                        '<td><span class="btn btn-xs btn-danger delete-product">Delete</span></td></tr>';
                });
                $("table").find('tbody').empty().html(table);
            }
        }).fail(function(error) {
            alert('Error loading products. Please try again.');
        });
    }

    // Save Product
    $("#saveProduct").on("click", function () {
        var form = $("#productForm");
        var name = $("#name").val().trim();
        var uom = $("#uoms").val();
        var price = $("#price").val().trim();

        // Validate inputs
        if (!name) {
            alert("Please enter product name");
            return;
        }
        if (!uom) {
            alert("Please select a unit of measurement");
            return;
        }
        if (!price || isNaN(price)) {
            alert("Please enter a valid price");
            return;
        }

        var requestPayload = {
            product_name: name,
            uom_id: uom,
            price_per_unit: parseFloat(price)
        };

        $.ajax({
            method: "POST",
            url: productSaveApiUrl,
            data: { 'data': JSON.stringify(requestPayload) },
            success: function(response) {
                alert('Product saved successfully!');
                productModal.modal('hide');
                loadProductTable();
            },
            error: function(xhr, status, error) {
                alert('Error saving product. Please try again.');
            }
        });
    });

    $(document).on("click", ".delete-product", function (){
        var tr = $(this).closest('tr');
        var data = {
            product_id : tr.data('id')
        };
        var isDelete = confirm("Are you sure to delete "+ tr.data('name') +" item?");
        if (isDelete) {
            callApi("POST", productDeleteApiUrl, data);
        }
    });

    productModal.on('hide.bs.modal', function(){
        $("#id").val('0');
        $("#name, #unit, #price").val('');
        productModal.find('.modal-title').text('Add New Product');
    });

    productModal.on('show.bs.modal', function(){
        //JSON data by API call for UOM dropdown
        $.get(uomListApiUrl, function (response) {
            if(response) {
                var options = '<option value="">--Select--</option>';
                $.each(response, function(index, uom) {
                    options += '<option value="'+ uom.uom_id +'">'+ uom.uom_name +'</option>';
                });
                $("#uoms").empty().html(options);
            }
        }).fail(function(error) {
            alert('Error loading units of measurement. Please try again.');
            productModal.modal('hide');
        });
    });