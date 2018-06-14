$(document).ready(function ($) {

	var myApp = function ($) {
		var phoneList = {};
		var phoneCategoryList = {};
		var phoneHalfLength, firstHalf, secondHalf, latestProducts;

		this.construct = function () {
			this.getPhonesByTypesOrCategories();
			this.getPhoneDetails()
			this.getFeaturedPhoneList();
			this.getPhoneCategires();

		}
		this.getPhoneDetails = function () {
			if (checkQueryStringExists('ID')) {
				var productID = getURLParameter('ID');
				var productType = jQuery("#product-type");
				var warrentyOrCondition = jQuery('#warrenty-or-condition');
				jQuery.getJSON('http://localhost:60064/api/phone/GetPhoneDetailsById?ID='+productID).done(function (data) {
					console.log(data)
					jQuery("#product-image").attr("src","themes/images/products/"+data.Image);
					jQuery("div.item a, #gallery a").attr("href","themes/images/products/"+data.Image);
					jQuery("div.item img").attr("src","themes/images/products/"+data.Image);
					jQuery("#product-name, #product-breadcrumb").html(data.Name);
					jQuery("#product-price").html('$'+ data.ItemPrice);
					jQuery('#product-color').html(data.Color);
					jQuery('#product-description').html(data.Description);
					if(data.Availability == 'Available'){
						jQuery("#product-availability").html("In Stock").css("color", "blue");
					}else{
						jQuery("#product-availability").html("Out of Stock").css("color", "red");
						jQuery('#order-now').hide();
					}
					if(data.Type == 'N'){
						productType.html('New');
						warrentyOrCondition.html('<span>Warrenty: '+data.Warrenty+'</span>');
					}else{
						productType.html('Used');
						warrentyOrCondition.html('<span>Condition: '+data.Condition+'</span>');
					}
				});

			} 
		}
		this.getPhonesByTypesOrCategories = function () {
			if (checkQueryStringExists('Type')) {
				getPhonesByType();
			} else if (checkQueryStringExists('categoryId')) {
				getPhonesByCategory();
			}
		}

		var checkQueryStringExists = function (param) {
			var queryString = '&' + (document.location + '?').split('?')[1];
			if (queryString.match(param)) {
				return true;
			}
			else {
				return false;
			}

		}
		var getURLParameter = function (sParam) {
			var sPageURL = window.location.search.substring(1);
			var sURLVariables = sPageURL.split('&');
			for (var i = 0; i < sURLVariables.length; i++) {
				var sParameterName = sURLVariables[i].split('=');
				if (sParameterName[0] == sParam) {
					return sParameterName[1];
				}
			}
		}
		var getPhonesByType = function () {
			var parameter = getURLParameter('Type')
			jQuery('.srchTxt').val(parameter);
			if (parameter == 'A') {
				jQuery.getJSON('http://localhost:60064/api/phone/GetPhoneList').done(function (data) {
					setProductListOnProductsPage(data);
				});
			} else {
				jQuery.getJSON('http://localhost:60064/api/phone/GetPhoneListByType?Type=' + parameter).done(function (data) {
					setProductListOnProductsPage(data)
				});
			}

		}
		var getPhonesByCategory = function () {
			var parameter = getURLParameter('categoryId')
			jQuery.getJSON('http://localhost:60064/api/phone/GetPhoneListByCategory?CategoryID=' + parameter).done(function (data) {
				setProductListOnProductsPage(data)
			});


		}
		this.getFeaturedPhoneList = function () {
			jQuery.getJSON('http://localhost:60064/api/phone/GetPhoneList').done(function (data) {

				latestProducts = data;
				getLatestProducts(latestProducts);
				phoneList = data;

				phoneHalfLength = Math.ceil(phoneList.length / 2);
				firstHalf = phoneList.splice(0, phoneHalfLength);
				secondHalf = phoneList;

				getFirstHalfFeatured(firstHalf);
				getSecondHalfFeatured(secondHalf);

			});
		}

		this.getPhoneCategires = function () {

			jQuery.getJSON('http://localhost:60064/api/phone/GetPhoneCategories').done(function (data) {
				phoneCategoryList = data
				setPhoneCategories(phoneCategoryList);
			});
		}
		this.construct();

		var setProductListOnProductsPage = function(phones){
			jQuery.each(phones, function (key, data) {
				jQuery('#listView').append(constructProductListViewHTML(data))
				jQuery('#blockView ul').append(constructProductListGridHTML(data))
			})
		}
		var getFirstHalfFeatured = function (firstHalf) {
			jQuery.each(firstHalf, function (key, data) {
				jQuery('#firstSetOfFeaturedProducts').append(constructFeaturedHTML(data))
			})
		}

		var getSecondHalfFeatured = function (secondHalf) {
			jQuery.each(secondHalf, function (key, data) {

				jQuery('#secondSetOfFeaturedProducts').append(constructFeaturedHTML(data))
			})
		}

		var getLatestProducts = function (latestProducts) {
			jQuery.each(latestProducts, function (key, data) {

				jQuery('#latestProducts').append(constructLatestHTML(data))
			})
		}

		var setPhoneCategories = function (categories) {
			jQuery.each(categories, function (key, data) {
				if (getURLParameter('categoryId') == data.Value) {
					jQuery('.phoneCategories').append('<li><a class="active" href="products.html?categoryId=' + data.Value + '">' +
						'<i class="icon-chevron-right"></i>' + data.Text + ' </a></li>')
				} else {
					jQuery('.phoneCategories').append('<li><a href="products.html?categoryId=' + data.Value + '">' +
						'<i class="icon-chevron-right"></i>' + data.Text + ' </a></li>')
				}

			})
		}

		var constructProductListViewHTML = function (data){
			var type = "New";
			if(data.Type == 'N'){
				 type = "New"
			}else{
				type = "Old"
			}
			return '<div class="row">'+	  
			'<div class="span2">'+	
				'<img src="themes/images/products/'+data.Image+'" alt=""/>'+
			'</div>'+
			'<div class="span4">'+
				'<h3>'+type +'| '+data.Availability+'</h3>'+			
				'<hr class="soft"/>'+
				'<h5>'+data.Name+' </h5>'+
				'<p>'+
				'Nowadays the  industry is one of the most successful business spheres.We always stay in touch with the latest fashion tendencies -'+
				'that is why our goods are so popular.'+
				'</p>'+
				'<a class="btn btn-small pull-right" href="product_details.html?ID='+data.ID+'">View Details</a>'+
				'<br class="clr"/>'+
			'</div>'+
			'<div class="span3 alignR">'+
			'<form class="form-horizontal qtyFrm">'+
			'<h3> $'+data.ItemPrice+'</h3>'+
									  			  '<a href="product_details.html?ID='+data.ID+'" class="btn btn-large"><i class="icon-zoom-in"></i></a>'+
			'</form>'+
			'</div>'+
		'</div>'+
		'<hr class="soft"/>'
		}

		var constructProductListGridHTML = function(data){
			return '<li class="span3">'+
			'<div class="thumbnail">'+
			  '<a href="product_details.html?ID='+data.ID+'"><img src="themes/images/products/'+data.Image+'" alt=""/></a>'+
			  '<div class="caption">'+
				'<h5>'+data.Name+'</h5>'+
				'<p>'+
				  'Im a paragraph. Click here'+
				'</p>'+
				 '<h4 style="text-align:center"><a class="btn" href="product_details.html?ID='+data.ID+'"> <i class="icon-zoom-in"></i></a> <a class="btn" style="visibility:hidden" href="#">Add to <i class="icon-shopping-cart"></i></a> <a class="btn btn-primary" href="#">$'+data.ItemPrice+'</a></h4>'+
			  '</div>'+
			'</div>'+
		  '</li>'
		}

		var constructFeaturedHTML = function (data) {
			return '<li class="span3">' +
				'<div class="thumbnail">' +
				'<i class="tag"></i>' +
				'<a href="product_details.html?ID='+data.ID+'">' +
				'<img src="themes/images/products/' + data.Image + '" alt="">' +
				'</a>' +
				'<div class="caption">' +
				'<h5>' + data.Name + '</h5>' +
				'<h4>' +
				'<a class="btn" href="product_details.html?ID='+data.ID+'">VIEW</a>' +
				' <span class="pull-right">$' + data.ItemPrice + '</span>' +
				'</h4>' +
				'</div>' +
				'</div>' +
				'</li>'
		}

		var constructLatestHTML = function (data) {
			return '<li class="span3">' +
				'<div class="thumbnail">' +
				'<a  href="product_details.html?ID='+data.ID+'"><img src="themes/images/products/' + data.Image + '" alt=""/></a>' +
				'<div class="caption">' +
				'<h5>' + data.Name + '</h5>' +
				'<p> Lorem Ipsum is simply dummy text. </p>' +
				'<h4 style="text-align:center"><a class="btn" href="product_details.html?ID='+data.ID+'"> <i class="icon-zoom-in"></i></a><a class="btn" href="#" style="visibility:hidden">Add to <i class="icon-shopping-cart"></i></a><a class="btn btn-primary" href="#">$' + data.ItemPrice + '</a></h4>' +
				'</div>' +
				'</div>' +
				'</li>'
		}


	}


	var myApp = new myApp();

	$('#submitButton').click(function (e) {
		e.preventDefault();
		var slectedType = $('.srchTxt').val();
		window.location.href = "products.html?Type=" + slectedType;
	});
	// var data = {
	// 	Name: 'Shane',
	// 	Email: 'shane@mailinator.com',
	// 	ProductId: '4',
	// 	Amount: '600'
	// }

	// $.ajax({
	// 	type: 'POST',
	// 	url: 'http://localhost:60064/api/phone/PostOrder',
	// 	dataType: "json",
	// 	data: data,
	// 	crossDomain: true,
	// 			success: function( response ) {
	// 		console.log( response ); // server response
	// 	},
	// 	error: function(error){
	// 		console.log(error);
	// 	}

	// })

});



