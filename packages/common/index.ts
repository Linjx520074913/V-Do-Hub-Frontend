import fs from "fs";
import os from "os";
import path from "path";
import { Logger } from "tslog";
import { MultiLingual } from "./locale/index";
import sudo from "./sudo-prompt--universal"

export * from './event/ob-event-bus';
export * from "./util";
export * from "./config";

import format from 'date-fns/format';

const logger = new Logger();

export { fs, os, path, format, logger };

export { MultiLingual };

export { sudo };