# jquery.leaf.js

Show item attributes when the mouse pointer over the link to the Amazon.

This plugin uses [Amazon ItemLookup Pipe](http://pipes.yahoo.com/pipes/pipe.info?_id=DM6ru9_R3BGmxGU9xAnzeQ) on the Yahoo Pipes.

## Require
	jQuery >= 1.2

## Usage
	<p><a class="amazon" href="http://www.amazon.co.jp/o/ASIN/B00005GXRX/clothfairy-22/ref=nosim">hotchpotch</a></p>
	<script type="text/javascript" src="jquery.js"></script>
	<script type="text/javascript" src="jquery.leaf.js"></script>
	<script type="text/javascript">
		// option. default is mine
		$.leafSetup({
			Locale        : `your locale`, // ca de, fr, jp, co.uk, com
			AWSAccessKeyId: `your AWSAccessKeyId`,
			AssociateTag  : `your AssociateTag`'
		});

		// attach event
		$('a.amazon').leaf();
	</script>

Requires `/ASIN\/([A-Z0-9]{10,13})/` in Amazon URL.
