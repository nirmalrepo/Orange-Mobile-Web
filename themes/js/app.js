$(document).ready(function ($) {

	var myApp = function ($) {
		var phoneList = {};
		var phoneCategoryList = {};
		var phoneHalfLength, firstHalf, secondHalf;

		this.construct = function () {
			this.getPhoneList();
			this.getPhoneCategires();

		}

		this.getPhoneList = function () {
			jQuery.getJSON('http://localhost:60064/api/phone/GetPhoneList').done(function (data) {
				phoneList = data
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
		var constructFeaturedHTML = function (data) {
			return '<li class="span3">' +
				'<div class="thumbnail">' +
				'<i class="tag"></i>' +
				'<a href="product_details.html">' +
				'<img src="themes/images/products/' + data.Image + '" alt="">' +
				'</a>' +
				'<div class="caption">' +
				'<h5>' + data.Name + '</h5>' +
				'<h4>' +
				'<a class="btn" href="product_details.html">VIEW</a>' +
				' <span class="pull-right">$' + data.ItemPrice + '</span>' +
				'</h4>' +
				'</div>' +
				'</div>' +
				'</li>'
		}

		// var  getURLParameter = function (sParam)
		// {
		// 	console.log('sss')
		// }​

	}


	var myApp = new myApp();
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



