
export const createElement = obj =>
	fillProps(document.createElement(obj.tagName), obj);

const fillProps = (e, props) => {
	setHtml(e, props);
	clean(props);
	setAttrs(props, e);
	return e;
};

const setHtml  = (el, { content }) =>
	content ? el.innerHTML = content : false;

const clean = props =>
	['tagName', 'content'].map(n => delete props[n]);

const setAttrs = (props, e) =>
	Object.keys(props).map(key => e.setAttribute(key, props[key]));