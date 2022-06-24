import { tofNode, tofStr, tofU } from './type-check';
import elManipulator from 'html-manipulator';

export default class ShadowDom {

	el = null;
	root = null;
	inserts = [];
	rootInsert = null;

	constructor(opts) {
		this.setParams(opts);
		if (!this.el) return false;
		if (!this.el.shadowRoot) {
			this.el.attachShadow({ mode: 'open' });
		}
		this.root = this.el.shadowRoot;
		this.rootInsert = this.root;
	}

	setParams(opts) {
		this.el = null;
		this.opts = { selector: '.shadow-rooted' };
		tofNode(opts)
			? this.setElement(opts)
			: this.setOptions(opts).setElement()
	}

	setOptions(opts) {
		tofStr(opts)
			? this.setOption('selector', opts)
			: Object.keys(opts).map(key => this.setOption(key, opts[key]));
		return this;
	}

	setOption(name, value) {
		this.opts[name] = !tofU(value) ? value : this.opts[name];
	}

	setElement(element) {
		let el = elManipulator.getElOr(element, this.opts.selector);
		this.el = el && el.tagName === 'IFRAME'
		          ? elManipulator.getContent(el).body : el;
	}

	/**
	 *
	 * @param {Array<object>} prints
	 * @param {String} selector
	 * @returns {ShadowDom}
	 */
	insertAll(prints, selector) {
		prints.map(print => this.insert(print, selector));
		return this;
	}

	/**
	 *
	 * @param {Object} print
	 * @param selector
	 * @returns {ShadowDom}
	 */
	insert(print, selector) {
		this.pushInsert(this.getInsert(print, selector));
		return this;
	}

	pushInsert(element) {
		this.inserts.push(element);
	}

	getInsert(obj, selector) {
		return elManipulator.appendElement(obj, this.getCurrentElement(selector));
	}

	bringInserts() {
		let inserts = [...this.inserts];
		this.inserts = [];
		return inserts;
	}

	append(selector, element) {
		this.find(selector).appendChild(element);
	}

	find(selector) {
		return elManipulator.find(this.inserts, selector);
	}

	select(selector) {
		return elManipulator.select(this.inserts, selector);
	}

	closest(selector) {
		return this.root.host.closest(selector);
	}

	/**
	 * Get Node element type based on selector parameter. Save insert source depends on magic word, selector or Node.
	 * @param selector
	 * @returns {null}
	 */
	getCurrentElement(selector) {
		return this.setInsert(selector).queryInsertRoot();
	}

	setInsert(source) {
		this.rootInsert = source
            ? (source !== 'ShadowRoot' ? source : this.root)
            : this.rootInsert;
		return this;
	}

	queryInsertRoot() {
		return tofNode(this.rootInsert)
		       ? this.rootInsert
		       : elManipulator.safeSelect(this.root, this.rootInsert);
	}

	clear() {
		elManipulator.removeEls(this.inserts);
		this.inserts = [];
		elManipulator.removeChildren(this.root);
		return true;
	}
}