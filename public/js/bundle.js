(function () {
	'use strict';

	function noop() {}

	function assign(tar, src) {
	  for (var k in src) tar[k] = src[k];

	  return tar;
	}

	function isPromise(value) {
	  return value && typeof value.then === 'function';
	}

	function exclude(src, prop) {
	  const tar = {};

	  for (const k in src) k === prop || (tar[k] = src[k]);

	  return tar;
	}

	function append(target, node) {
	  target.appendChild(node);
	}

	function insert(target, node, anchor) {
	  target.insertBefore(node, anchor);
	}

	function detachNode(node) {
	  node.parentNode.removeChild(node);
	}

	function createElement(name) {
	  return document.createElement(name);
	}

	function createText(data) {
	  return document.createTextNode(data);
	}

	function createComment() {
	  return document.createComment('');
	}

	function setData(text, data) {
	  text.data = '' + data;
	}

	function handlePromise(promise, info) {
	  var token = info.token = {};

	  function update(type, index, key, value) {
	    if (info.token !== token) return;
	    info.resolved = key && {
	      [key]: value
	    };
	    const child_ctx = assign(assign({}, info.ctx), info.resolved);
	    const block = type && (info.current = type)(info.component, child_ctx);

	    if (info.block) {
	      if (info.blocks) {
	        info.blocks.forEach((block, i) => {
	          if (i !== index && block) {
	            block.o(() => {
	              block.d(1);
	              info.blocks[i] = null;
	            });
	          }
	        });
	      } else {
	        info.block.d(1);
	      }

	      block.c();
	      block[block.i ? 'i' : 'm'](info.mount(), info.anchor);
	      info.component.root.set({}); // flush any handlers that were created
	    }

	    info.block = block;
	    if (info.blocks) info.blocks[index] = block;
	  }

	  if (isPromise(promise)) {
	    promise.then(value => {
	      update(info.then, 1, info.value, value);
	    }, error => {
	      update(info.catch, 2, info.error, error);
	    }); // if we previously had a then/catch block, destroy it

	    if (info.current !== info.pending) {
	      update(info.pending, 0);
	      return true;
	    }
	  } else {
	    if (info.current !== info.then) {
	      update(info.then, 1, info.value, promise);
	      return true;
	    }

	    info.resolved = {
	      [info.value]: promise
	    };
	  }
	}

	function blankObject() {
	  return Object.create(null);
	}

	function destroy(detach) {
	  this.destroy = noop;
	  this.fire('destroy');
	  this.set = noop;

	  this._fragment.d(detach !== false);

	  this._fragment = null;
	  this._state = {};
	}

	function _differs(a, b) {
	  return a != a ? b == b : a !== b || a && typeof a === 'object' || typeof a === 'function';
	}

	function fire(eventName, data) {
	  var handlers = eventName in this._handlers && this._handlers[eventName].slice();

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

	function flush(component) {
	  component._lock = true;
	  callAll(component._beforecreate);
	  callAll(component._oncreate);
	  callAll(component._aftercreate);
	  component._lock = false;
	}

	function get() {
	  return this._state;
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

	function on(eventName, handler) {
	  var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	  handlers.push(handler);
	  return {
	    cancel: function () {
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
	    this.fire("state", {
	      changed: changed,
	      current: this._state,
	      previous: oldState
	    });

	    this._fragment.p(changed, this._state);

	    this.fire("update", {
	      changed: changed,
	      current: this._state,
	      previous: oldState
	    });
	  }
	}

	function _stage(newState) {
	  assign(this._staged, newState);
	}

	function callAll(fns) {
	  while (fns && fns.length) fns.shift()();
	}

	function _mount(target, anchor) {
	  this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
	}

	var proto = {
	  destroy,
	  get,
	  fire,
	  on,
	  set,
	  _recompute: noop,
	  _set,
	  _stage,
	  _mount,
	  _differs
	};

	/* src/components/Homepage.html generated by Svelte v2.15.1 */

	function homepageData(appData) {
	  return fetch(appData.dataUrl)
	    .then(res => res.json())
	    .then(data => data.userData);
	}

	function data() {
	  return {
	    dataUrl: "http://localhost:3000/js/userData.json"
	  }
	}
	function add_css() {
		var style = createElement("style");
		style.id = 'svelte-brtwwd-style';
		style.textContent = ".page.svelte-brtwwd{background:#66B5C5}";
		append(document.head, style);
	}

	function create_main_fragment(component, ctx) {
		var div, promise;

		let info = {
			component,
			ctx,
			current: null,
			pending: create_pending_block,
			then: create_then_block,
			catch: create_catch_block,
			value: 'userData',
			error: 'theError'
		};

		handlePromise(promise = ctx.homepageData, info);

		return {
			c() {
				div = createElement("div");

				info.block.c();
				div.className = "page svelte-brtwwd";
			},

			m(target, anchor) {
				insert(target, div, anchor);

				info.block.m(div, info.anchor = null);
				info.mount = () => div;
			},

			p(changed, _ctx) {
				ctx = _ctx;
				info.ctx = ctx;

				if (('homepageData' in changed) && promise !== (promise = ctx.homepageData) && handlePromise(promise, info)) ; else {
					info.block.p(changed, assign(assign({}, ctx), info.resolved));
				}
			},

			d(detach) {
				if (detach) {
					detachNode(div);
				}

				info.block.d();
				info = null;
			}
		};
	}

	// (6:4) {:catch theError}
	function create_catch_block(component, ctx) {
		var p, text0, text1_value = ctx.theError.message, text1;

		return {
			c() {
				p = createElement("p");
				text0 = createText("whoops! ");
				text1 = createText(text1_value);
			},

			m(target, anchor) {
				insert(target, p, anchor);
				append(p, text0);
				append(p, text1);
			},

			p(changed, ctx) {
				if ((changed.homepageData) && text1_value !== (text1_value = ctx.theError.message)) {
					setData(text1, text1_value);
				}
			},

			d(detach) {
				if (detach) {
					detachNode(p);
				}
			}
		};
	}

	// (4:4) {:then userData}
	function create_then_block(component, ctx) {
		var text_value = ctx.userData.username, text;

		return {
			c() {
				text = createText(text_value);
			},

			m(target, anchor) {
				insert(target, text, anchor);
			},

			p(changed, ctx) {
				if ((changed.homepageData) && text_value !== (text_value = ctx.userData.username)) {
					setData(text, text_value);
				}
			},

			d(detach) {
				if (detach) {
					detachNode(text);
				}
			}
		};
	}

	// (2:23)      Loading...     {:then userData}
	function create_pending_block(component, ctx) {
		var text;

		return {
			c() {
				text = createText("Loading...");
			},

			m(target, anchor) {
				insert(target, text, anchor);
			},

			p: noop,

			d(detach) {
				if (detach) {
					detachNode(text);
				}
			}
		};
	}

	function Homepage(options) {
		init(this, options);
		this._state = assign(data(), options.data);

		this._recompute({  }, this._state);
		this._intro = true;

		if (!document.getElementById("svelte-brtwwd-style")) add_css();

		this._fragment = create_main_fragment(this, this._state);

		if (options.target) {
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}
	}

	assign(Homepage.prototype, proto);

	Homepage.prototype._recompute = function _recompute(changed, state) {
		if (this._differs(state.homepageData, (state.homepageData = homepageData(exclude(state, "homepageData"))))) changed.homepageData = true;
	};

	/* src/components/App.html generated by Svelte v2.15.1 */

	function currentPage(page) {
					return Homepage;
				}

	function data$1() {
	  return {
	    page: webpage
	  }
	}
	function create_main_fragment$1(component, ctx) {
		var switch_instance_anchor;

		var switch_value = ctx.currentPage;

		function switch_props(ctx) {
			return {
				root: component.root,
				store: component.store
			};
		}

		if (switch_value) {
			var switch_instance = new switch_value(switch_props(ctx));
		}

		return {
			c() {
				if (switch_instance) switch_instance._fragment.c();
				switch_instance_anchor = createComment();
			},

			m(target, anchor) {
				if (switch_instance) {
					switch_instance._mount(target, anchor);
				}

				insert(target, switch_instance_anchor, anchor);
			},

			p(changed, ctx) {
				if (switch_value !== (switch_value = ctx.currentPage)) {
					if (switch_instance) {
						switch_instance.destroy();
					}

					if (switch_value) {
						switch_instance = new switch_value(switch_props(ctx));
						switch_instance._fragment.c();
						switch_instance._mount(switch_instance_anchor.parentNode, switch_instance_anchor);
					} else {
						switch_instance = null;
					}
				}
			},

			d(detach) {
				if (detach) {
					detachNode(switch_instance_anchor);
				}

				if (switch_instance) switch_instance.destroy(detach);
			}
		};
	}

	function App(options) {
		init(this, options);
		this._state = assign(data$1(), options.data);

		this._recompute({  }, this._state);
		this._intro = true;

		this._fragment = create_main_fragment$1(this, this._state);

		if (options.target) {
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}
	}

	assign(App.prototype, proto);

	App.prototype._recompute = function _recompute(changed, state) {
		if (this._differs(state.currentPage, (state.currentPage = currentPage(exclude(state, "currentPage"))))) changed.currentPage = true;
	};

	var AppComponent = new App({
	  target: document.querySelector('.app')
	});

}());
