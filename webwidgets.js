/**
 **
 **  @license
 **  Copyright (C) 2016 - Donato Pirozzi (donatopirozzi[at]gmail[dot]com)
 **  This file is part of WEBWIDGET framework.
 **  WEBWIDGET is free software: you can redistribute it and/or modify
 **  it under the terms of the GNU Lesser General Public License as published by
 **  the Free Software Foundation, either version 3 of the License, or
 **  (at your option) any later version.
 **  WEBWIDGET is distributed in the hope that it will be useful,
 **  but WITHOUT ANY WARRANTY; without even the implied warranty of
 **  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 **  GNU Lesser General Public License for more details.
 **  Distributed under the GNU LGPL v3. For full terms see the file LICENSE.
 **  License: http://www.gnu.org/licenses/lgpl.html LGPL version 3 or higher
 **  Contributors:
 **      - Donato Pirozzi (donatopirozzi[at]gmail[dot]com)
 **
 **/

class WebWidgets {

    static define(_WClazz) {
        //_WClazz must have the is static property.
        if (typeof _WClazz.is === 'undefined')
            throw "The web component must have a static property named 'static get is()' ";

        //pre-condition: it exists a dom-module with '_WClazz.is' in the imported html files (rel=import).
        const _wwDomModule = WebWidgets.findDomModuleWithId(_WClazz.is);
        if (_wwDomModule == null)
            throw 'Cannot find any web widget with id <' + _WClazz.is + '>';

        let WClazz = class extends _WClazz {
            constructor() {
                super();

                this.$ = {};

                //Initialize shadowDom and its template.
                let shadowRoot = this.attachShadow({ mode: 'open' });
                this.$.shadowRoot = shadowRoot; //Save the shadowRoot for a next use.
                const _wcTemplate = _wwDomModule.querySelector('template');

                if (_wcTemplate != null) {//The WC could not have the template tag.
                    const _importedTemplate = document.importNode(_wcTemplate.content, true);
                    shadowRoot.appendChild(_importedTemplate);
                }

                //Finds all the ids in the shadow dom to map it in the $ object.
                const _elementsWithIdAttribute = this.$.shadowRoot.querySelectorAll("[id]");
                for (let i=0; i<_elementsWithIdAttribute.length; i++) {
                    const _element = _elementsWithIdAttribute[i];
                    const _id = _element.id;
                    this.$[_id] = _element;
                }//EndFor.

                //Generate getter and setter for the attributes.
                const obAttr = this.constructor.observedAttributes;
                if (typeof obAttr != 'undefined')
                    for (let i=0,_attrName; i<obAttr.length && (_attrName = obAttr[i]); i++) {
                        this['_' + _attrName] = undefined;
                        Object.defineProperty(this, _attrName, {
                            get: function () { return this['_' + _attrName]; },
                            set: function (v) { this.setAttribute(_attrName, v); }
                        });
                    }

                //Calls lifecycle callback.
                if (typeof this.constructedCallback === 'function')  this.constructedCallback();
            }//EndFakeConstruction.
        };

        //Register the web component.
        window.customElements.define(WClazz.is, WClazz);
    }//EndFunction.

    /**
     * It accesses to the page <link> tags in the head of the page to find
     * imports where the id matches the 'findId' in the parameter.
     * @param findId
     */
    static findDomModuleWithId(findId) {
        const _domModuleSelector = 'dom-module[id=' + findId + ']';
        var stack = [];

        //List all the tag 'link' with attribute 'rel=import'.
        Array.from(document.querySelectorAll('link[rel=import]')).forEach(link => { stack.push(link); });

        while (stack.length > 0) {//BFS.
            var _link = stack.shift();
            var _shadowDocument = _link.import;

            //Shadow dom cannot be null, maybe it has not been loaded at this point,
            //so push it again in the stack.
            if (_shadowDocument === null) {
                stack.push(_link);
                continue;
            }

            var foundedDomModule = (_shadowDocument.querySelector(_domModuleSelector));
            if (foundedDomModule) return foundedDomModule;

            //Module not found, so it looks for other (inside this shadow dom) link[rel=import].
            Array.from(_shadowDocument.querySelectorAll('link[rel=import]')).forEach(link => { stack.push(link); });
        }

        throw 'Cannot find ' + _domModuleSelector + ' in the page.';
    }//EndFunction.
    
};//EndClass.


