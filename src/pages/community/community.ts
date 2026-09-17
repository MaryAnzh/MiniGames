import { Component } from '@components';
import type { ComponentProps } from '@types';

type CommunityPageProps = Pick<ComponentProps, 'parentNode'>;

export class CommunityPage {
  constructor({ parentNode }: CommunityPageProps) {
    new Component({
      parentNode,
      tagName: 'section',
      className: 'community_page',
      content: 'Community Page',
    });
  }
}
