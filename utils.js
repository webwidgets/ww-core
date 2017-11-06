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

class Utils {

    static MathMinOfArraysLength(arr1, arr2) {
        var _length1 = typeof arr1 !== 'undefined' ? arr1.length : 0;
        var _length2 = typeof arr2 !== 'undefined' ? arr2.length : 0;
        return Math.min(_length1, _length2);
    }//EndFunction.

    static MathMin(var1, var2) {
        if (typeof var1 === 'undefined') return var2;
        if (typeof var2 === 'undefined') return var1;
        return Math.min(var1, var2);
    }//EndFunction.

    static HttpRequest(method, url) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function (event) {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send();
        });
    }//EndFunction.

    static HttpGetRequest(url) {
        return Utils.HttpRequest("GET", url);
    }//EndFunction.

}//EndClass.