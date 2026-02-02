import {expectType} from 'tsd';
import safeStringify from './index.js';

expectType<string>(safeStringify(1));
safeStringify('foo', {indentation: '\t'});
safeStringify('foo', {indentation: 2});
safeStringify('foo', {trace: true});
