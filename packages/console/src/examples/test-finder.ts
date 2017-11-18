#!/usr/bin/env node
import "reflect-metadata";
import { cli, CliConfig, HelpHelper as BaseHelper, OptionConfig } from "../";

new CommandFinder()