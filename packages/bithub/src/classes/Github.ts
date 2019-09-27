import BaseGithub from '@octokit/rest';
import { decorate, injectable } from 'inversify';
import { singleton } from '../app';


decorate(injectable(), BaseGithub);

export type Github = BaseGithub
export const Github:typeof BaseGithub= BaseGithub

