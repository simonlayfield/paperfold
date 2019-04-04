/* src/components/client/TextEdit.html generated by Svelte v2.15.3 */
var TextEdit = (function() { "use strict";

	function data() {
  return {
    active: false
  }
};

	var methods = {
  toggleActive() {
    const {active} =this.get();
    this.set({active: !active});
  }
};

	function add_css() {
		var style = createElement("style");
		style.id = 'svelte-zlu2yu-style';
		style.textContent = ".textEditForm.svelte-zlu2yu,.textEditValue.svelte-zlu2yu{display:none}.textEditForm.-active.svelte-zlu2yu,.textEditValue.-active.svelte-zlu2yu{display:inline-block}.value.svelte-zlu2yu{margin-right:1rem}";
		append(document.head, style);
	}

	function create_main_fragment(component, ctx) {
		var div, span, text0, text1, button, div_class_value, text3, form, input0, input0_updating = false, text4, input1, form_class_value;

		function click_handler(event) {
			component.toggleActive();
		}

		function input0_input_handler() {
			input0_updating = true;
			component.set({ value: input0.value });
			input0_updating = false;
		}

		return {
			c() {
				div = createElement("div");
				span = createElement("span");
				text0 = createText(ctx.value);
				text1 = createText("\n  ");
				button = createElement("button");
				button.textContent = "Edit";
				text3 = createText("\n\n");
				form = createElement("form");
				input0 = createElement("input");
				text4 = createText("\n  ");
				input1 = createElement("input");
				span.className = "value svelte-zlu2yu";
				span.id = ctx.id;
				addListener(button, "click", click_handler);
				button.className = "button -small";
				div.className = div_class_value = "textEditValue " + (ctx.active ? '' : '-active') + " svelte-zlu2yu";
				addListener(input0, "input", input0_input_handler);
				input0.className = "value svelte-zlu2yu";
				setAttribute(input0, "type", "text");
				input1.className = "button -small";
				setAttribute(input1, "type", "submit");
				input1.name = "submit";
				input1.value = "Done";
				form.action = ctx.action;
				form.method = "post";
				form.className = form_class_value = "textEditForm " + (ctx.active ? '-active' : '') + " svelte-zlu2yu";
			},

			m(target, anchor) {
				insert(target, div, anchor);
				append(div, span);
				append(span, text0);
				append(div, text1);
				append(div, button);
				insert(target, text3, anchor);
				insert(target, form, anchor);
				append(form, input0);

				input0.value = ctx.value;

				append(form, text4);
				append(form, input1);
			},

			p(changed, ctx) {
				if (changed.value) {
					setData(text0, ctx.value);
				}

				if (changed.id) {
					span.id = ctx.id;
				}

				if ((changed.active) && div_class_value !== (div_class_value = "textEditValue " + (ctx.active ? '' : '-active') + " svelte-zlu2yu")) {
					div.className = div_class_value;
				}

				if (!input0_updating && changed.value) input0.value = ctx.value;
				if (changed.action) {
					form.action = ctx.action;
				}

				if ((changed.active) && form_class_value !== (form_class_value = "textEditForm " + (ctx.active ? '-active' : '') + " svelte-zlu2yu")) {
					form.className = form_class_value;
				}
			},

			d(detach) {
				if (detach) {
					detachNode(div);
				}

				removeListener(button, "click", click_handler);
				if (detach) {
					detachNode(text3);
					detachNode(form);
				}

				removeListener(input0, "input", input0_input_handler);
			}
		};
	}

	function TextEdit(options) {
		init(this, options);
		this._state = assign(data(), options.data);
		this._intro = true;

		if (!document.getElementById("svelte-zlu2yu-style")) add_css();

		this._fragment = create_main_fragment(this, this._state);

		if (options.target) {
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}
	}

	assign(TextEdit.prototype, {
	 	destroy: destroy,
	 	get: get,
	 	fire: fire,
	 	on: on,
	 	set: set,
	 	_set: _set,
	 	_stage: _stage,
	 	_mount: _mount,
	 	_differs: _differs
	 });
	assign(TextEdit.prototype, methods);

	TextEdit.prototype._recompute = noop;

	function createElement(name) {
		return document.createElement(name);
	}

	function append(target, node) {
		target.appendChild(node);
	}

	function createText(data) {
		return document.createTextNode(data);
	}

	function addListener(node, event, handler, options) {
		node.addEventListener(event, handler, options);
	}

	function setAttribute(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else node.setAttribute(attribute, value);
	}

	function insert(target, node, anchor) {
		target.insertBefore(node, anchor);
	}

	function setData(text, data) {
		text.data = '' + data;
	}

	function detachNode(node) {
		node.parentNode.removeChild(node);
	}

	function removeListener(node, event, handler, options) {
		node.removeEventListener(event, handler, options);
	}

	function init(component, options) {
		component._handlers = blankObject();
		component._slots = blankObject();
		component._bind = options._bind;
		component._staged = {};

		component.options = options;
		component.root = options.root || component;
		component.store = options.store || component.root.store;

		if (!options.root) {
			component._beforecreate = [];
			component._oncreate = [];
			component._aftercreate = [];
		}
	}

	function assign(tar, src) {
		for (var k in src) tar[k] = src[k];
		return tar;
	}

	function destroy(detach) {
		this.destroy = noop;
		this.fire('destroy');
		this.set = noop;

		this._fragment.d(detach !== false);
		this._fragment = null;
		this._state = {};
	}

	function get() {
		return this._state;
	}

	function fire(eventName, data) {
		var handlers =
			eventName in this._handlers && this._handlers[eventName].slice();
		if (!handlers) return;

		for (var i = 0; i < handlers.length; i += 1) {
			var handler = handlers[i];

			if (!handler.__calling) {
				try {
					handler.__calling = true;
					handler.call(this, data);
				} finally {
					handler.__calling = false;
				}
			}
		}
	}

	function on(eventName, handler) {
		var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
		handlers.push(handler);

		return {
			cancel: function() {
				var index = handlers.indexOf(handler);
				if (~index) handlers.splice(index, 1);
			}
		};
	}

	function set(newState) {
		this._set(assign({}, newState));
		if (this.root._lock) return;
		flush(this.root);
	}

	function _set(newState) {
		var oldState = this._state,
			changed = {},
			dirty = false;

		newState = assign(this._staged, newState);
		this._staged = {};

		for (var key in newState) {
			if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
		}
		if (!dirty) return;

		this._state = assign(assign({}, oldState), newState);
		this._recompute(changed, this._state);
		if (this._bind) this._bind(changed, this._state);

		if (this._fragment) {
			this.fire("state", { changed: changed, current: this._state, previous: oldState });
			this._fragment.p(changed, this._state);
			this.fire("update", { changed: changed, current: this._state, previous: oldState });
		}
	}

	function _stage(newState) {
		assign(this._staged, newState);
	}

	function _mount(target, anchor) {
		this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
	}

	function _differs(a, b) {
		return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}

	function noop() {}

	function blankObject() {
		return Object.create(null);
	}

	function flush(component) {
		component._lock = true;
		callAll(component._beforecreate);
		callAll(component._oncreate);
		callAll(component._aftercreate);
		component._lock = false;
	}

	function callAll(fns) {
		while (fns && fns.length) fns.shift()();
	}
	return TextEdit;
}());