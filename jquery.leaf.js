
(function($) {
	var uri = 'http://pipes.yahoo.com/pipes/pipe.run';
	var queries = {
		AWSAccessKeyId: '17WV92D5WX2R1VET0H02',
		AssociateTag  : 'clothfairy-22',
		ItemId        : null,
		_id           : 'DM6ru9_R3BGmxGU9xAnzeQ',
		_render       : 'json'
	};
	var asin = /ASIN\/([A-Z0-9]{10,13})/;
	var template = $([
		'<div class="leaf">',
		'<div class="image"/>',
		'<div class="main">',
		'<h5/>',
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
	var container = null;

	var show = function(e) {
		var itemId = e.data.itemId;
		var leaf = $('#leaf-'+itemId);
		var a = $(this);

		if (leaf.length)
			leaf.show();
		else {
			var q = queries.extend({ ItemId: itemId }, queries);
			$.getJSON(uri+'?_callback=?', q, function(data) {
				var item = data.value.items[0].Items.Item;
				var attr = item.ItemAttributes;
				var listing = item.Offers.Offer.OfferListing;
				var m = item.MediumImage;

				var image = m ?
					linkHTML('<img src="'+m.URL+'" alt="'+attr.Title+'" width="'+m.Width.content+'" height="'+m.Height.content+'"/>') :
					'';
				var date = attr.ReleaseDate || attr.PublicationDate || '-';
				var creator = creatorHTML(attr[this]);
				var price = (offerListing.Price.FormattedPrice || '-').replace(/￥ /, '¥');

				leaf = template
					.clone()
					.attr('id', 'leaf-'+itemId)
					.find('.image').html(image).end()
					.find('h5').html('['+attr.ProductGroup.toLowerCase()+'] '+linkHTML(attr.Title)).end()
					.find('.creator').html(creator).end()
					.find('.price').text(price).end()
					.find('.availability').text(offerListing.Availability || '-').end()
					.find('.release-date').text(date).end()
					.find('.rating').text(item.CustomerReviews.AverageRatin || '-').end()
					.find('.asin').text(itemId).end()
					.appendTo(container)
					.mouseout(function(e) {
						if ($(e.relatedTarget).parent()[0] != container[0])
							$(this).fadeOut('fast');
					});
			});
		}
		leaf.css('top', a.offset().top + a.height() / 2 - leaf.height() / 2);
	};

	var linkHTML = function(content) {
		return '<a href="http://www.amazon.co.jp/o/ASIN/'+item.ASIN+'/'+queries.AssociateTag+'/ref=nosim">'+content+'</a>';
	};

	var creatorHTML = function(attr) {
		var ret = [];
		var type = ['Author', 'Artist', 'Manufacturer', 'Publisher'];
		$.each(type, function() {
			var c = attr[this];
			if (!c) return;
			if (typeof c == 'string') c = [c];
			ret.push($.map(c, function(n) {
				return n
					.replace(/&/g, '&amp;')
					.replace(/"/g, '&quot;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;');
			}));
		});
		return ret ?
			'<li>'+$.unique(ret).join('</li><li>')+'</li>' :
			'<li>-</li>';
	};

	$.fn.leaf = function() {
		if (!container) container = $('<div id="leaf"/>').appendTo('body');

		return this.each(function() {
			if (!this.href) return;
			var itemId = asin.exec(this.href);
			if (!itemId) return;
			$(this).bind('mouseover', { itemId: itemId }, show);
		});
	};
})(jQuery);
