'use strict';
import {createLocalVue} from '@vue/test-utils';
import MockAdapter from 'axios-mock-adapter';
import {assert, config as chaiConfig} from 'chai';
import Vuex from 'vuex';
import scripts, {axiosInstance} from '../../js/admin/scripts-config/scripts-module'

chaiConfig.truncateThreshold = 0;

const localVue = createLocalVue();
localVue.use(Vuex);

const axiosMock = new MockAdapter(axiosInstance);
const flushPromises = () => new Promise(resolve => setTimeout(resolve));


function mockGetScripts(scripts) {
    axiosMock.onGet('scripts')
        .reply(200, {scripts});
}

describe('Test admin script module', function () {
    let store;

    beforeEach(async function () {
        store = new Vuex.Store({
            modules: {
                scripts: scripts
            }
        });
    });

    describe('Test load scripts', function () {

            it('test load single script', async function () {
                mockGetScripts([{'name': 'script1'}]);

                await store.dispatch('scripts/init');
                await flushPromises();

                assert.deepEqual(store.state.scripts.scripts, ['script1']);
                assert.isFalse(store.state.scripts.loading);
            });

            it('test load multiple unsorted scripts', async function () {
                mockGetScripts([{'name': 'def', 'group': 'some_group'}, {'name': 'xyz'}, {'name': 'abc'}]);

                await store.dispatch('scripts/init');
                await flushPromises();

                assert.deepEqual(store.state.scripts.scripts, ['abc', 'def', 'xyz']);
                assert.isFalse(store.state.scripts.loading);
            });
        }
    )
});
