/**
 * Testing src/indentHtml.js functions
 *
 * indentHtml
 **/

const { indentHtml } = require('../src/indentHtml.js');

/**
 * indentHtml
 */
describe('indentHtml', () => {
	test.only('Ensure HTML is indented consistently', () => {
		const result = indentHtml(
			'<!--[if !IE]><!--><script>window.alert(0);</script><!--<![endif]--><![CDATA[cdata]]><!-- HTML Comment --><script>window.alert(1); /* JS Comment */</script><style>body { background: #fff; }</style><div class="GEL-component1-v1_1_0-look1"><h1>Heading</h1><p><strong>Paragraph text</strong></p><ul><li>List item 1</li> \n\n<li>List item 2</li></ul><a href="https://test.com">Link</a><div><span><a href="https://test.com"><strong>Text</strong></a></span><button type="submit" /></div></div>'
		);

		expect(result).toStrictEqual(`<!--[if !IE]><!-->
	<script>
		window.alert(0);
	</script>
<!--<![endif]-->
<![CDATA[cdata]]>
<!-- HTML Comment -->
<script>
	window.alert(1); /* JS Comment */
</script>
<style>
	body { background: #fff; }
</style>
<div class="GEL-component1-v1_1_0-look1">
	<h1>Heading</h1>
	<p>
		<strong>Paragraph text</strong>
	</p>
	<ul>
		<li>
			List item 1
		</li>
		<li>
			List item 2
		</li>
	</ul><a href="https://test.com">Link</a>
	<div>
		<span>
			<a href="https://test.com"><strong>Text</strong></a>
		</span>
		<button type="submit" />
	</div>
</div>`);
	});
});
