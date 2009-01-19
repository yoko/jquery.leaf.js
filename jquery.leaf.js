
(function($) {
	var uri = 'http://pipes.yahoo.com/pipes/pipe.run?_id=DM6ru9_R3BGmxGU9xAnzeQ&_render=json&_callback=?';
	var queries = {
		Locale        : 'jp',
		AWSAccessKeyId: '17WV92D5WX2R1VET0H02',
		AssociateTag  : 'clothfairy-22'
	};
	var asin = /ASIN\/([A-Z0-9]{10,13})/;
	var template = $([
		'<div class="leaf">',
		'<div class="image"/>',
		'<div class="main">',
		'<div class="title"/>',
		'<ul class="creator"/>',
		'<dl>',
		'<dt>Price</dt><dd class="price"/>',
		'<dt>Availability</dt><dd class="availability"/>',
		'<dt>Release Date</dt><dd class="release-date"/>',
		'<dt>Rating</dt><dd class="rating"/>',
		'<dt>ASIN</dt><dd class="asin"/>',
		'</dl>',
		'</div>',
		'</div>'
	].join(''));
	var loading = {};
	var container = null;

	var linkHTML = function(asin, content) {
		return '<a href="http://www.amazon.co.jp/o/ASIN/'+asin+'/'+queries.AssociateTag+'/ref=nosim">'+content+'</a>';
	};

	var creatorHTML = function(attr) {
		var creators = [];
		var type = ['Author', 'Artist', 'Creator', 'Manufacturer', 'Publisher'];
		$.each(type, function() {
			var c = attr[this];
			if (!c) return;
			if (typeof c == 'string') c = [c];
			creators = creators.concat(
				$.grep(
					$.map(c, function(n) {
						return (n.content || n)
							.replace(/&/g, '&amp;')
							.replace(/"/g, '&quot;')
							.replace(/</g, '&lt;')
							.replace(/>/g, '&gt;');
					}),
					function(n) {
						return ($.inArray(n, creators) == -1);
				})
			);
		});
		creators = creators.join('</li><li>') || '-';
		return '<li>'+creators+'</li>';
	};

	$.leafSetup = function(q) {
		$.extend(queries, q);
	};

	$.fn.leaf = function(callback) {
		if (!container) container = $('<div id="leaf"/>').appendTo('body');

		return this.each(function() {
			if (!this.href) return;
			var itemId = asin.exec(this.href);
			if (!itemId) return;
			itemId = itemId[1];

			var a = $(this), position = null;
			a.mouseover(function() {
				if (loading[itemId]) return;
				loading[itemId] = true;

				$('.leaf', container).mouseout();
				var leaf = $('#leaf-'+itemId);
				if (leaf.length) {
					leaf.css('top', position);
					leaf.show();
					loading[itemId] = false;
				}
				else {
					var q = $.extend({}, queries, { ItemId: itemId });
					$.getJSON(uri, q, function(data) {
						var items = data.value.items[0].Items;
						if (items.Request.Errors) throw new Error(items.Request.Errors.Error.Message);
						var item = items.Item;
						var attr = item.ItemAttributes;
						var listing = (item.Offers.Offer || {}).OfferListing || {};
						var m = item.MediumImage;

						var image = m ?
							linkHTML(itemId, '<img src="'+m.URL+'" alt="'+attr.Title+'" width="'+m.Width.content+'" height="'+m.Height.content+'"/>') :
							'';
						var title = '['+attr.ProductGroup.toLowerCase()+'] '+linkHTML(itemId, attr.Title);
						var creator = creatorHTML(attr);
						var price = (listing.Price || {}).FormattedPrice || '-';
						var availability = listing.Availability || '-';
						var date = attr.ReleaseDate || attr.PublicationDate || '-';
						var rating = (item.CustomerReviews || {}).AverageRating || '-';

						leaf = template
							.clone()
							.attr('id', 'leaf-'+itemId)
							.find('.image').html(image).end()
							.find('.title').html(title).end()
							.find('.creator').html(creator).end()
							.find('.price').text(price).end()
							.find('.availability').text(availability).end()
							.find('.release-date').text(date).end()
							.find('.rating').text(rating).end()
							.find('.asin').text(itemId).end()
							.appendTo(container)
							.mouseout(function(e) {
								if (!$(e.relatedTarget).parents('#leaf').length)
									$(this).fadeOut('fast');
							});
							leaf.css('top', position = a.offset().top + a.height() / 2 - leaf.height() / 2);

						if (callback) callback.call(leaf);
						loading[itemId] = false;
					});
				}
			});
		});
	};
})(jQuery);
