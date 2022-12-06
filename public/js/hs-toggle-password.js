function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
* HSTogglePassword Plugin
* @version: 1.0.0 (Sat, 30 Jul 2021)
* @requires: tom-select 1.7.26
* @author: HtmlStream
* @event-namespace: .HSTogglePassword
* @license: Htmlstream Libraries (https://htmlstream.com/)
* Copyright 2021 Htmlstream
*/
var dataAttributeName = 'data-hs-toggle-password-options';
var defaults = {
  classChangeTarget: null,
  defaultClass: null,
  showClass: null,
  show: false
};

var HSTogglePassword = /*#__PURE__*/function () {
  function HSTogglePassword(el, options, id) {
    _classCallCheck(this, HSTogglePassword);

    this.collection = [];
    var that = this;
    var elems;

    if (el instanceof HTMLElement) {
      elems = [el];
    } else if (el instanceof Object) {
      elems = el;
    } else {
      elems = document.querySelectorAll(el);
    }

    for (var i = 0; i < elems.length; i += 1) {
      that.addToCollection(elems[i], options, id || elems[i].id);
    }

    if (!that.collection.length) {
      return false;
    } // initialization calls


    that._init();

    return this;
  }

  _createClass(HSTogglePassword, [{
    key: "_init",
    value: function _init() {
      var that = this;

      for (var i = 0; i < that.collection.length; i += 1) {
        var _$el = void 0;

        var _options = void 0;

        if (that.collection[i].hasOwnProperty('$initializedEl')) {
          continue;
        }

        _$el = that.collection[i].$el;
        _options = that.collection[i].options;

        if (Array.isArray(_options.target)) {
          (function () {
            var targets = [];

            _options.target.forEach(function (target) {
              targets.push(document.querySelector(target));
            });

            _options.target = targets;
            _options.classChangeTarget = _options.classChangeTarget ? document.querySelector(_options.classChangeTarget) : _options.target;
          })();
        } else {
          _options.target = document.querySelector(_options.target);
          _options.classChangeTarget = _options.classChangeTarget ? document.querySelector(_options.classChangeTarget) : _options.target;
        }

        if (_options.show) {
          _$el.type = "text";
        }

        that._toggleClass(_options, _options.show);

        that._showPassword(_$el, _options);
      }
    }
  }, {
    key: "_showPassword",
    value: function _showPassword(el, config) {
      var that = this,
          $target = config.target;

      if (Array.isArray($target)) {
        $target.forEach(function (target) {
          target.addEventListener('click', function (event) {
            if (el.type === "password") {
              el.type = "text";

              that._toggleClass(config, true);
            } else {
              el.type = "password";

              that._toggleClass(config, false);
            }
          });
        });
      } else {
        $target.addEventListener('click', function (event) {
          if (el.type === "password") {
            el.type = "text";

            that._toggleClass(config, true);
          } else {
            el.type = "password";

            that._toggleClass(config, false);
          }
        });
      }
    }
  }, {
    key: "_toggleClass",
    value: function _toggleClass(config) {
      var _this = this;

      var isShow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var that = this,
          $target = config.classChangeTarget;

      if (Array.isArray($target)) {
        $target.forEach(function (target) {
          if (isShow) {
            _this._removeClasses(target, config.defaultClass);

            _this._addClasses(target, config.showClass);
          } else {
            _this._removeClasses(target, config.showClass);

            _this._addClasses(target, config.defaultClass);
          }
        });
      } else {
        if (isShow) {
          this._removeClasses($target, config.defaultClass);

          this._addClasses($target, config.showClass);
        } else {
          this._removeClasses($target, config.showClass);

          this._addClasses($target, config.defaultClass);
        }
      }
    }
  }, {
    key: "_addClasses",
    value: function _addClasses($target, classes) {
      if (classes && classes.trim().indexOf(' ') != -1) {
        var array = classes.split(' ');

        for (var i = 0, length = array.length; i < length; i++) {
          $target.classList.add(array[i]);
        }
      } else {
        $target.classList.add(classes);
      }
    }
  }, {
    key: "_removeClasses",
    value: function _removeClasses($target, classes) {
      if (classes && classes.trim().indexOf(' ') != -1) {
        var array = classes.split(' ');

        for (var i = 0, length = array.length; i < length; i++) {
          $target.classList.remove(array[i]);
        }
      } else {
        $target.classList.remove(classes);
      }
    }
  }, {
    key: "addToCollection",
    value: function addToCollection(item, options, id) {
      this.collection.push({
        $el: item,
        id: id || null,
        options: Object.assign({}, defaults, item.hasAttribute(dataAttributeName) ? JSON.parse(item.getAttribute(dataAttributeName)) : {}, options)
      });
    }
  }, {
    key: "getItem",
    value: function getItem(item) {
      if (typeof item === 'number') {
        return this.collection[item].$initializedEl;
      } else {
        return this.collection.find(function (el) {
          return el.id === item;
        }).$initializedEl;
      }
    }
  }]);

  return HSTogglePassword;
}();
