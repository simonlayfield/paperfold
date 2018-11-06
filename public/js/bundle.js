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

	function destroyEach(iterations, detach) {
	  for (var i = 0; i < iterations.length; i += 1) {
	    if (iterations[i]) iterations[i].d(detach);
	  }
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

	function addListener(node, event, handler, options) {
	  node.addEventListener(event, handler, options);
	}

	function removeListener(node, event, handler, options) {
	  node.removeEventListener(event, handler, options);
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

	function userData_1(data) {
	  return fetch(data.userDataUrl)
	    .then(res => res.json())
	    .then(data => data);
	}

	function documentsData(data) {
	  return fetch(data.documentsDataUrl)
	    .then(res => res.json())
	    .then(data => data);
	}

	function data() {
	  return {
	    userDataUrl: "/userData?" + currentUser,
	    documentsDataUrl: "/dashboardData?" + userData.contribution
	  }
	}
	function add_css() {
		var style = createElement("style");
		style.id = 'svelte-1jz22or-style';
		style.textContent = ".username.svelte-1jz22or{margin-top:2rem;margin-bottom:2rem}.panel-collection.svelte-1jz22or{display:grid;grid-gap:30px;grid-template-columns:repeat(4, 1fr)}.panel.svelte-1jz22or{padding:2rem;border:1px solid #66b5c5}.title.svelte-1jz22or{text-align:center;padding-top:2rem;padding-bottom:2rem}.title.svelte-1jz22or a.svelte-1jz22or{color:#666}";
		append(document.head, style);
	}

	function get_each_context(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.object = list[i][0];
		child_ctx.document = list[i][1];
		return child_ctx;
	}

	function create_main_fragment(component, ctx) {
		var div, promise, text0, h3, text2, promise_1;

		let info = {
			component,
			ctx,
			current: null,
			pending: create_pending_block_2,
			then: create_then_block_2,
			catch: create_catch_block_2,
			value: 'userData',
			error: 'theError'
		};

		handlePromise(promise = ctx.userData, info);

		let info_1 = {
			component,
			ctx,
			current: null,
			pending: create_pending_block,
			then: create_then_block,
			catch: create_catch_block_1,
			value: 'null',
			error: 'theError'
		};

		handlePromise(promise_1 = ctx.userData, info_1);

		return {
			c() {
				div = createElement("div");

				info.block.c();

				text0 = createText("\n\n  ");
				h3 = createElement("h3");
				h3.textContent = "Stories";
				text2 = createText("\n\n  ");

				info_1.block.c();
				div.className = "page";
			},

			m(target, anchor) {
				insert(target, div, anchor);

				info.block.m(div, info.anchor = null);
				info.mount = () => div;

				append(div, text0);
				append(div, h3);
				append(div, text2);

				info_1.block.m(div, info_1.anchor = null);
				info_1.mount = () => div;
			},

			p(changed, _ctx) {
				ctx = _ctx;
				info.ctx = ctx;

				if (('userData' in changed) && promise !== (promise = ctx.userData) && handlePromise(promise, info)) ; else {
					info.block.p(changed, assign(assign({}, ctx), info.resolved));
				}

				info_1.ctx = ctx;

				if (('userData' in changed) && promise_1 !== (promise_1 = ctx.userData) && handlePromise(promise_1, info_1)) ; else {
					info_1.block.p(changed, assign(assign({}, ctx), info_1.resolved));
				}
			},

			d(detach) {
				if (detach) {
					detachNode(div);
				}

				info.block.d();
				info = null;

				info_1.block.d();
				info_1 = null;
			}
		};
	}

	// (6:4) {:catch theError}
	function create_catch_block_2(component, ctx) {
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
				if ((changed.userData) && text1_value !== (text1_value = ctx.theError.message)) {
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
	function create_then_block_2(component, ctx) {
		var div, text0, text1_value = ctx.userData.username, text1;

		return {
			c() {
				div = createElement("div");
				text0 = createText("Username: ");
				text1 = createText(text1_value);
				div.className = "username svelte-1jz22or";
			},

			m(target, anchor) {
				insert(target, div, anchor);
				append(div, text0);
				append(div, text1);
			},

			p(changed, ctx) {
				if ((changed.userData) && text1_value !== (text1_value = ctx.userData.username)) {
					setData(text1, text1_value);
				}
			},

			d(detach) {
				if (detach) {
					detachNode(div);
				}
			}
		};
	}

	// (2:19)      Loading...     {:then userData}
	function create_pending_block_2(component, ctx) {
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

	// (35:4) {:catch theError}
	function create_catch_block_1(component, ctx) {
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
				if ((changed.userData) && text1_value !== (text1_value = ctx.theError.message)) {
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

	// (14:4) {:then}
	function create_then_block(component, ctx) {
		var await_block_anchor, promise;

		let info = {
			component,
			ctx,
			current: null,
			pending: create_pending_block_1,
			then: create_then_block_1,
			catch: create_catch_block,
			value: 'documentsData',
			error: 'theError'
		};

		handlePromise(promise = ctx.documentsData, info);

		return {
			c() {
				await_block_anchor = createComment();

				info.block.c();
			},

			m(target, anchor) {
				insert(target, await_block_anchor, anchor);

				info.block.m(target, info.anchor = anchor);
				info.mount = () => div;
			},

			p(changed, _ctx) {
				ctx = _ctx;
				info.ctx = ctx;

				if (('documentsData' in changed) && promise !== (promise = ctx.documentsData) && handlePromise(promise, info)) ; else {
					info.block.p(changed, assign(assign({}, ctx), info.resolved));
				}
			},

			d(detach) {
				if (detach) {
					detachNode(await_block_anchor);
				}

				info.block.d(detach);
				info = null;
			}
		};
	}

	// (29:6) {:catch theError}
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
				if ((changed.documentsData) && text1_value !== (text1_value = ctx.theError.message)) {
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

	// (20:6) {:then documentsData}
	function create_then_block_1(component, ctx) {
		var div;

		var each_value = ctx.Object.entries(ctx.documentsData);

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block(component, get_each_context(ctx, each_value, i));
		}

		return {
			c() {
				div = createElement("div");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}
				div.className = "panel-collection svelte-1jz22or";
			},

			m(target, anchor) {
				insert(target, div, anchor);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(div, null);
				}
			},

			p(changed, ctx) {
				if (changed.Object || changed.documentsData) {
					each_value = ctx.Object.entries(ctx.documentsData);

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block(component, child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(div, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value.length;
				}
			},

			d(detach) {
				if (detach) {
					detachNode(div);
				}

				destroyEach(each_blocks, detach);
			}
		};
	}

	// (22:10) {#each Object.entries(documentsData) as [object, document]}
	function create_each_block(component, ctx) {
		var div2, div0, a0, img, img_src_value, text0, div1, a1, text1_value = ctx.document.title, text1, text2;

		return {
			c() {
				div2 = createElement("div");
				div0 = createElement("div");
				a0 = createElement("a");
				img = createElement("img");
				text0 = createText("\n              ");
				div1 = createElement("div");
				a1 = createElement("a");
				text1 = createText(text1_value);
				text2 = createText("\n            ");
				img.src = img_src_value = "images/covers/Cover-" + ctx.document.title.replace(/ /g, '-') + ".jpg";
				img.alt = "";
				a0.href = "/story";
				div0.className = "cover";
				a1.href = "/story";
				a1.className = "svelte-1jz22or";
				div1.className = "title svelte-1jz22or";
				div2.className = "panel svelte-1jz22or";
			},

			m(target, anchor) {
				insert(target, div2, anchor);
				append(div2, div0);
				append(div0, a0);
				append(a0, img);
				append(div2, text0);
				append(div2, div1);
				append(div1, a1);
				append(a1, text1);
				append(div2, text2);
			},

			p(changed, ctx) {
				if ((changed.Object || changed.documentsData) && img_src_value !== (img_src_value = "images/covers/Cover-" + ctx.document.title.replace(/ /g, '-') + ".jpg")) {
					img.src = img_src_value;
				}

				if ((changed.Object || changed.documentsData) && text1_value !== (text1_value = ctx.document.title)) {
					setData(text1, text1_value);
				}
			},

			d(detach) {
				if (detach) {
					detachNode(div2);
				}
			}
		};
	}

	// (18:26)        Loading...       {:then documentsData}
	function create_pending_block_1(component, ctx) {
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

	// (12:19)      Loading...     {:then}
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
		this._state = assign(assign({ Object : Object }, data()), options.data);

		this._recompute({  }, this._state);
		this._intro = true;

		if (!document.getElementById("svelte-1jz22or-style")) add_css();

		this._fragment = create_main_fragment(this, this._state);

		if (options.target) {
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}
	}

	assign(Homepage.prototype, proto);

	Homepage.prototype._recompute = function _recompute(changed, state) {
		if (this._differs(state.userData, (state.userData = userData_1(exclude(state, "userData"))))) changed.userData = true;
		if (this._differs(state.documentsData, (state.documentsData = documentsData(exclude(state, "documentsData"))))) changed.documentsData = true;
	};

	/* src/components/Story.html generated by Svelte v2.15.1 */

	function data$1() {
	  return {
	    "story": "It was raining heavily..."
	  }
	}
	var methods = {
	  submit() {
	    const storyEdit = document.getElementById("storyEdit"),
	          storyField = document.getElementById("storyField"),
	          storyContent = document.getElementById("storyContent");
	    this.set({story: storyEdit.innerHTML});
	    storyContent.submit();
	  }
	};

	function add_css$1() {
		var style = createElement("style");
		style.id = 'svelte-1ghc9i6-style';
		style.textContent = "h1.svelte-1ghc9i6{text-align:center}.story.svelte-1ghc9i6{width:100%;border:none;outline:none;color:#666;margin:3rem 0}.container.svelte-1ghc9i6{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;grid-gap:50px}button.svelte-1ghc9i6{background:#000;color:#fff;border:none;outline:none;font-size:1rem;padding:1rem;cursor:pointer;transition:background .1s linear}button.svelte-1ghc9i6:hover{background:#666}";
		append(document.head, style);
	}

	function create_main_fragment$1(component, ctx) {
		var div3, div1, h1, text1, div0, text2, text3, form, textarea, text4, button, text6, div2;

		function click_handler(event) {
			component.submit();
		}

		return {
			c() {
				div3 = createElement("div");
				div1 = createElement("div");
				h1 = createElement("h1");
				h1.textContent = "Title";
				text1 = createText("\n    ");
				div0 = createElement("div");
				text2 = createText(ctx.story);
				text3 = createText("\n    ");
				form = createElement("form");
				textarea = createElement("textarea");
				text4 = createText("\n    ");
				button = createElement("button");
				button.textContent = "Save";
				text6 = createText("\n  ");
				div2 = createElement("div");
				div2.innerHTML = `<img src="" alt="">`;
				h1.className = "svelte-1ghc9i6";
				div0.className = "story svelte-1ghc9i6";
				div0.id = "storyEdit";
				div0.contentEditable = true;
				textarea.rows = "4";
				textarea.cols = "50";
				textarea.name = "content";
				textarea.value = ctx.story;
				form.hidden = true;
				form.action = "/storySubmission";
				form.method = "POST";
				form.id = "storyContent";
				addListener(button, "click", click_handler);
				button.type = "submit";
				button.className = "svelte-1ghc9i6";
				div1.className = "edit";
				div2.className = "illustration";
				div3.className = "container -split svelte-1ghc9i6";
			},

			m(target, anchor) {
				insert(target, div3, anchor);
				append(div3, div1);
				append(div1, h1);
				append(div1, text1);
				append(div1, div0);
				append(div0, text2);
				append(div1, text3);
				append(div1, form);
				append(form, textarea);
				append(div1, text4);
				append(div1, button);
				append(div3, text6);
				append(div3, div2);
			},

			p(changed, ctx) {
				if (changed.story) {
					setData(text2, ctx.story);
					textarea.value = ctx.story;
				}
			},

			d(detach) {
				if (detach) {
					detachNode(div3);
				}

				removeListener(button, "click", click_handler);
			}
		};
	}

	function Story(options) {
		init(this, options);
		this._state = assign(data$1(), options.data);
		this._intro = true;

		if (!document.getElementById("svelte-1ghc9i6-style")) add_css$1();

		this._fragment = create_main_fragment$1(this, this._state);

		if (options.target) {
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}
	}

	assign(Story.prototype, proto);
	assign(Story.prototype, methods);

	/* src/components/Illustration.html generated by Svelte v2.15.1 */

	function add_css$2() {
		var style = createElement("style");
		style.id = 'svelte-1wdv9cp-style';
		style.textContent = "h1.svelte-1wdv9cp{text-align:center}";
		append(document.head, style);
	}

	function create_main_fragment$2(component, ctx) {
		var h1, text_1, form;

		return {
			c() {
				h1 = createElement("h1");
				h1.textContent = "Submit illustrations to paperfold";
				text_1 = createText("\n\n");
				form = createElement("form");
				form.innerHTML = `<input type="file">`;
				h1.className = "svelte-1wdv9cp";
				form.action = "#";
			},

			m(target, anchor) {
				insert(target, h1, anchor);
				insert(target, text_1, anchor);
				insert(target, form, anchor);
			},

			p: noop,

			d(detach) {
				if (detach) {
					detachNode(h1);
					detachNode(text_1);
					detachNode(form);
				}
			}
		};
	}

	function Illustration(options) {
		init(this, options);
		this._state = assign({}, options.data);
		this._intro = true;

		if (!document.getElementById("svelte-1wdv9cp-style")) add_css$2();

		this._fragment = create_main_fragment$2(this, this._state);

		if (options.target) {
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}
	}

	assign(Illustration.prototype, proto);

	/* src/components/App.html generated by Svelte v2.15.1 */

	function currentPage(data) {
	  if (data.page === 'story') return Story;
	  if (data.page === 'illustration') return Illustration;
					return Homepage;
				}

	function data$2() {
	  return {
	    page: webpage
	  }
	}
	function create_main_fragment$3(component, ctx) {
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
		this._state = assign(data$2(), options.data);

		this._recompute({  }, this._state);
		this._intro = true;

		this._fragment = create_main_fragment$3(this, this._state);

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
