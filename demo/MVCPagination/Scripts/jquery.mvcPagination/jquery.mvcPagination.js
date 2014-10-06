/*!
 * jQuery MVC pagination plugin v1.0.0
 * http://ikezili.github.io/mvc-pagination/
 *
 * Copyright 2014, Leandro Ikezili
 * Released under Apache 2.0 license
 * http://apache.org/licenses/LICENSE-2.0.html
 */

(function ($, window, document) {

    'use strict';

    var mvcPagination = function (element, settings) {
        this.$element = $(element);
        this.settings = $.extend({}, $.fn.mvcPagination.defaultSettings, settings);

        if (this.settings.startPage < 1 || this.settings.startPage > this.settings.totalPages) {
            throw new Error('Start page option is incorrect');
        }

        this.settings.totalPages = parseInt(this.settings.totalPages);
        if (isNaN(this.settings.totalPages)) {
        	throw new Error('Total pages option is incorrect!');
        }

        this.settings.visiblePages = parseInt(this.settings.visiblePages);
        if (isNaN(this.settings.visiblePages)) {
        	throw new Error('Visible pages option is incorrect!');
        }

        if (this.settings.totalPages < this.settings.visiblePages) {
            this.settings.visiblePages = this.settings.totalPages;
        }

        if (this.settings.onClick instanceof Function) {
            this.$element.first().bind('page', this.settings.onClick);
        }

        var tagName = (typeof this.$element.prop === 'function') ? this.$element.prop('tagName') : this.$element.attr('tagName');

        if (tagName === 'UL') {
            this.$listContainer = this.$element;
        } else {
            this.$listContainer = $('<ul></ul>');
        }

        this.$listContainer.addClass(this.settings.paginationClass);

        if (tagName !== 'UL') {
            this.$element.append(this.$listContainer);
        }

        this.renderPagination(this.calcPages(this.settings.startPage));

        return this;
    };

    mvcPagination.prototype = {

        show: function (page) {
            if (page < 1 || page > this.settings.totalPages) {
            	throw new Error('Page is incorrect.');
            }

            this.renderPagination(this.calcPages(page));

            this.$element.trigger('page', page);

            return this;
        },


        buildPageItem: function (type, page, el_class) {
            var itemContainer = $('<li></li>'),
                itemContent = $('<a></a>'),
                itemText = null;

            itemContainer.addClass(el_class);
            itemContainer.data('page', page);

            switch (type) {
                case 'page':
                    itemText = page;
                    break;
                case 'first':
                    itemText = this.settings.first;
                    break;
                case 'prev':
                    itemText = this.settings.prev;
                    break;
                case 'next':
                    itemText = this.settings.next;
                    break;
                case 'last':
                    itemText = this.settings.last;
                    break;
                default:
                    break;
            }

            if (this.settings.onClick !== null && this.settings.onClick instanceof Function) {
            	itemContent.attr('onclick', "return false;");
            }

            itemContainer.append(itemContent.attr('href', this.href(page)).html(itemText));
            return itemContainer;
        },

        calcPages: function (currentPage) {
            var pages = [];

            var half = Math.floor(this.settings.visiblePages / 2);
            var start = currentPage - half + 1 - this.settings.visiblePages % 2;
            var end = currentPage + half;

            if (start <= 0) {
                start = 1;
                end = this.settings.visiblePages;
            }
            if (end > this.settings.totalPages) {
                start = this.settings.totalPages - this.settings.visiblePages + 1;
                end = this.settings.totalPages;
            }

            var itPage = start;
            while (itPage <= end) {
                pages.push(itPage);
                itPage++;
            }

            return {"currentPage": currentPage, "numeric": pages};
        },

        renderPagination: function (pages) {
        	this.$listContainer.children().remove();
			var $listItems = $();

			/*Generate Links Page*/
        	if (this.settings.showControl) {
        		if (this.settings.first && this.settings.showFirstLast)
        			$listItems = $listItems.add(this.buildPageItem('first', 1, this.settings.firstClass));
        		
        		if (this.settings.prev && this.settings.showPrevNext) {
        			var prev = pages.currentPage > 1 ? pages.currentPage - 1 : 1;
        			$listItems = $listItems.add(this.buildPageItem('prev', prev, this.settings.prevClass));
        		}
        	}

        	for (var i = 0; i < pages.numeric.length; i++) {
        		$listItems = $listItems.add(this.buildPageItem('page', pages.numeric[i], this.settings.pageClass));
        	}

        	if (this.settings.showControl) {
        		if (this.settings.next && this.settings.showPrevNext) {
        			var next = pages.currentPage >= this.settings.totalPages ? this.settings.totalPages : pages.currentPage + 1;
        			$listItems = $listItems.add(this.buildPageItem('next', next, this.settings.nextClass));
        		}

        		if (this.settings.last && this.settings.showFirstLast)
        			$listItems = $listItems.add(this.buildPageItem('last', this.settings.totalPages, this.settings.lastClass));
        	}

        	this.$listContainer.append($listItems);

            this.$listContainer.find('.'+this.settings.pageClass).removeClass(this.settings.activeClass).filter(function () {
                return $(this).data('page') === pages.currentPage;
            }).addClass(this.settings.activeClass);

            if (this.settings.showControl) {
            	if (pages.currentPage === 1 && this.settings.showPrevNext) {
            		this.$listContainer.find('.' + this.settings.prevClass + ' a,.' + this.settings.firstClass + ' a').attr("href", "javascript:void(0);");
            	}

            	if (pages.currentPage === this.settings.totalPages && this.settings.showPrevNext) {
            		this.$listContainer.find('.' + this.settings.nextClass + ' a,.' + this.settings.lastClass + ' a').attr("href", "javascript:void(0);");
            	}


            	if (this.settings.showFirstLast) {
            		this.$listContainer.find('.' + this.settings.firstClass).toggleClass(this.settings.disabledClass, pages.currentPage === 1);

            		this.$listContainer.find('.' + this.settings.lastClass).toggleClass(this.settings.disabledClass, pages.currentPage === this.settings.totalPages);
            	}

            	if (this.settings.showPrevNext) {
            		this.$listContainer.find('.' + this.settings.prevClass).toggleClass(this.settings.disabledClass, pages.currentPage === 1);

            		this.$listContainer.find('.' + this.settings.nextClass).toggleClass(this.settings.disabledClass, pages.currentPage === this.settings.totalPages);
            	}
            }

            this.configEvents();
        },

        configEvents: function () {
            var base = this;
            this.$listContainer.find('li').each(function () {
                var $this = $(this);
                $this.off();
                if ($this.hasClass(base.settings.disabledClass) || $this.hasClass(base.settings.activeClass)) return;
                $this.click(function () {
                	base.show(parseInt($this.data('page'), 10));
                });
            });
        },

        href: function (c) {
            return this.settings.href.replace(this.settings.hrefVariable, c);
        },
        destroy: function () {
        	this.$element.empty();
        	this.$element.removeData('mvc-pagination');
        	this.$element.unbind('page');
        	return this;
        }



    };

    $.fn.mvcPagination = function (option) {

        var $this = $(this);
        var data = $this.data('mvc-pagination');
        var settings = typeof option === 'object' && option;

		if (!data) $this.data('mvc-pagination', (data = new mvcPagination(this, settings)));

		return (data === undefined) ? $this : data;
    };

    $.fn.mvcPagination.defaultSettings = {
        totalPages: 0,
        startPage: 1,
        visiblePages: 5,
        href: 'javascript:void(0);',
        hrefVariable: '{{number}}',
        first: 'First',
        prev: 'Previous',
        next: 'Next',
        last: 'Last',
        onClick: null,
        paginationClass: 'pagination',
        nextClass: 'next',
        prevClass: 'prev',
        lastClass: 'last',
        firstClass: 'first',
        pageClass: 'page',
        activeClass: 'active',
        disabledClass: 'disabled',
        showControl: true,
        showFirstLast: true,
		showPrevNext: true
    };


})(jQuery, window, document);

