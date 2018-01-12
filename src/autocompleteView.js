import {
    qs,
    on,
    delegate
} from './helpers';
export default class View {
    constructor() {
        this.searchEl = qs('#search_str');
        this.suggestionsEl = qs('.autocomplete_suggestions');
        this.searchButtonEl = qs('.search_btn');
    }

    bind(bindCmd, handler) {
        const bindCommands = {
            press: () => {
                on(this.searchEl, 'keyup', e => handler(e.target.value, e.keyCode));
            },
            click: () => {
                delegate(this.suggestionsEl, '.autocomplete_suggestion', 'click', e => handler(e.delegateTarget));
            },
            submit: () => {
                on(this.searchButtonEl, 'click', () => handler(this.searchEl.value));
            },
            searches: () => {
                on(this.searchEl, 'click', () => handler(!this.suggestionsEl.innerHTML, this.searchEl.value));
            },
            nonClick: () => {
                delegate('body', '*', 'click', e => handler(e.target !== this.searchEl));
            }
        };

        bindCommands[bindCmd]();
    }

    render(viewCmd, ...parameter) {
        const viewCommands = {
            autoComplete: () => {
                this.renderAutoComplete(...parameter);
            },
            searches: () => {
                this.renderSearches(...parameter);
            }
        };

        viewCommands[viewCmd]();
    }

    renderSearches(searches) {
        const searchesStr = searches.map(search =>
            `<li class="autocomplete_suggestion searches"data-value="${search}">${search} </li>`).join('');
        this.suggestionsEl.insertAdjacentHTML('afterbegin', searchesStr);
    }

    renderAutoComplete(term, suggestions) {
        this.emptyAutoComplete();
        const target = new RegExp(term, 'g');
        const suggestionsStr = suggestions.map(suggestion =>
            `<li class="autocomplete_suggestion" data-value="${suggestion[0]}">
            ${suggestion[0].replace(target, `<b>${term}</b>`)}</li>`).join('');
        this.suggestionsEl.insertAdjacentHTML('afterbegin', suggestionsStr);
    }

    updateAutoComplete(target) {
        this.sel = target;
    }

    enterAutoComplete() {
        if (this.sel && this.suggestionsEl.innerHTML) {
            this.searchEl.value = this.sel.dataset.value;
            this.emptyAutoComplete();
        }
    }

    moveAutoComplete(key) {
        this.sel = qs('.autocomplete_suggestion.selected');
        let target;
        if (this.sel) {
            target = key === 40 ? this.sel.nextSibling : this.sel.previousSibling;
            this.sel.classList.remove('selected');
        } else {
            target = key === 40 ? this.suggestionsEl.firstChild : this.suggestionsEl.lastChild;
        }
        target.classList.add('selected');
        this.updateAutoComplete(target);
    }

    emptyAutoComplete() {
        this.suggestionsEl.innerHTML = '';
    }

    emptySearchbar() {
        this.searchEl.value = '';
    }

}