import * as bootstrap from 'bootstrap';

/**
 * Alerts the user with a message
 *
 * @param {string} message
 * @returns {*}
 */
export const alert = (message: string) => {
    return new Promise<void>(res => {
        const div = create(`
        <div class="modal fade" tabindex="-1" data-bs-backdrop="static">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Alert</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>${message}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Ok</button>
            </div>
          </div>
        </div>
      </div>
        `);
        document.body.append(div);

        const modal = new bootstrap.Modal(div);

        modal.show();

        div.addEventListener('hidden.bs.modal', () => {
            res();
            div.remove();
        });
    });
};

/**
 * Returns a promise that resolves to a boolean value
 *
 * @param {string} message
 * @returns {*}
 */
export const confirm = (message: string) => {
    return new Promise<boolean>(res => {
        const div = create(`
            <div class="modal fade" tabindex="-1" data-bs-backdrop="static">
            <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title">Alert</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary yes" data-bs-dismiss="modal">Yes</button>
                    <button type="button" class="btn btn-secondary no" data-bs-dismiss="modal">No</button>
                </div>
            </div>
            </div>
        </div>
        `);

        let resolved = false;
        const resolve = (data: boolean) => {
            if (resolved) return;
            resolved = true;
            res(data);
        };

        document.body.append(div);

        const modal = new bootstrap.Modal(div);

        div.querySelector('.yes')?.addEventListener('click', () => {
            resolve(true);
        });

        div.querySelector('.no')?.addEventListener('click', () => {
            resolve(false);
        });

        div.addEventListener('hidden.bs.modal', () => {
            div.remove();
            resolve(false);
        });

        modal.show();
    });
};

/**
 * Prompts the user with a message and an input field
 *
 * @param {string} message
 * @param {?Partial<{
 *     datalist: string[]
 * }>} [options]
 * @returns {*}
 */
export const prompt = (
    message: string,
    options?: Partial<{
        datalist: string[];
    }>
) => {
    return new Promise<string | null>(res => {
        const div = create(`
            <div class="modal fade" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title">Alert</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                <p>${message}</p>
                <input type="text" class="form-control">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary ok" data-bs-dismiss="modal">Ok</button>
                    <button type="button" class="btn btn-secondary cancel" data-bs-dismiss="modal">Cancel</button>
                </div>
            </div>
            </div>
        </div>
        `);

        document.body.append(div);

        const modal = new bootstrap.Modal(div);

        const input = div.querySelector('input') as HTMLInputElement;
        input.focus();

        if (options?.datalist) {
            const datalist = create(`<datalist id="datalist"></datalist>`);
            options.datalist.forEach(item => {
                const option = create(`<option value="${item}"></option>`);
                datalist.append(option);
            });
            input.setAttribute('list', 'datalist');
            input.after(datalist);
        }

        input.addEventListener('keyup', e => {
            switch (e.key) {
                case 'Enter':
                    resolve(input.value);
                    modal.hide();
                    break;
                case 'Escape':
                    resolve(null);
                    modal.hide();
                    break;
            }
        });

        let resolved = false;
        const resolve = (data: string | null) => {
            if (resolved) return;
            resolved = true;
            res(data);
        };

        div.querySelector('.ok')?.addEventListener('click', () => {
            resolve(input.value);
            modal.hide();
        });

        div.querySelector('.cancel')?.addEventListener('click', () => {
            resolve(null);
            modal.hide();
        });

        div.querySelector('.btn-close')?.addEventListener('click', () => {
            resolve(null);
            modal.hide();
        });

        modal.show();
    });
};

/**
 * Prompts the user with a message and a select field
 *
 * @param {string} message
 * @param {string[]} options
 * @returns {Promise<number|null>}
 */
export const select = (
    message: string,
    options: string[],
    opts?: {
        defaultSelected?: number;
        defaultMessage?: string;
    }
): Promise<number | null> => {
    return new Promise<number | null>(res => {
        const div = create(`
            <div class="modal fade" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title">${message}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                <select class="form-select">
                </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary ok" data-bs-dismiss="modal">Ok</button>
                    <button type="button" class="btn btn-secondary cancel" data-bs-dismiss="modal">Cancel</button>
                </div>
            </div>
            </div>
        </div>
        `);

        document.body.append(div);

        const modal = new bootstrap.Modal(div);

        const select = div.querySelector('select') as HTMLSelectElement;
        if (opts?.defaultMessage) {
            const opt = create(
                `<option value="-1">${opts.defaultMessage}</option>`
            ) as HTMLOptionElement;
            opt.disabled = true;
            opt.selected = true;
            select.append(opt);
        }
        options.forEach((option, index) => {
            const opt = create(
                `<option value="${index}">${option}</option>`
            ) as HTMLOptionElement;
            if (index === opts?.defaultSelected) opt.selected = true;
            select.append(opt);
        });

        select.focus();

        let resolved = false;
        const resolve = (data: number | null) => {
            if (resolved) return;
            resolved = true;
            if (data !== null && data !== -1 && opts?.defaultMessage) data--;
            res(data);
        };

        div.querySelector('.ok')?.addEventListener('click', () => {
            resolve(select.selectedIndex);
            modal.hide();
        });

        div.querySelector('.cancel')?.addEventListener('click', () => {
            resolve(null);
            modal.hide();
        });

        div.querySelector('.btn-close')?.addEventListener('click', () => {
            resolve(null);
            modal.hide();
        });

        modal.show();
    });
};

/**
 * Prompts the user with a message and two buttons
 *
 * @param {string} message
 * @param {string} a
 * @param {string} b
 * @returns {Promise<string|null>}
 */
export const choose = (
    message: string,
    a: string,
    b: string
): Promise<string | null> => {
    return new Promise<string | null>(res => {
        const div = create(`
            <div class="modal fade" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title">Alert</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary a" data-bs-dismiss="modal">${a}</button>
                    <button type="button" class="btn btn-secondary b" data-bs-dismiss="modal">${b}</button>
                </div>
                `);

        document.body.append(div);

        const modal = new bootstrap.Modal(div);

        let resolved = false;
        const resolve = (data: string | null) => {
            if (resolved) return;
            resolved = true;
            res(data);
        };

        div.querySelector('.a')?.addEventListener('click', () => {
            resolve(a);
            modal.hide();
        });

        div.querySelector('.b')?.addEventListener('click', () => {
            resolve(b);
            modal.hide();
        });

        div.querySelector('.btn-close')?.addEventListener('click', () => {
            resolve(null);
            modal.hide();
        });

        modal.show();
    });
};
