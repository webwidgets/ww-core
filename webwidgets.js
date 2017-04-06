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
        let WClazz = class extends _WClazz {
            constructor() {
                super();

                let shadowRoot = this.attachShadow({ mode: 'open' });

                const _wcDomModule = LighterWC.findDomModuleWithId(super.constructor.is);
                const _wcTemplate = _wcDomModule.querySelector('template');
                const _importedTemplate = document.importNode(_wcTemplate.content, true);
                shadowRoot.appendChild(_importedTemplate);
            }
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
        //List all the tag 'link' with attribute 'rel=import'.
        //The file content is in the '.import' property.
        const _linkImports = document.querySelectorAll('link[rel=import]');
        const _arrLinkImports = Array.from(_linkImports);
        const _domModuleSelector = 'dom-module[id=' + findId + ']';

        var _domModules = _arrLinkImports.map( (link) => {
            return link.import.querySelector(_domModuleSelector);
        });

        if (_domModules.length == 0)
            throw 'Cannot find ' + _domModuleSelector + ' in the page.';

        if (_domModules.length > 1)
            throw 'The same ' + _domModuleSelector + ' has been imported more than one time.';

        return _domModules[0];
    }//EndFunction.

};//EndClass.


