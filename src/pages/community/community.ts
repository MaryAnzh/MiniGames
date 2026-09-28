import { Component } from '@components';
import type { ComponentProps } from '@types';

type CommunityPageProps = Pick<ComponentProps, 'parentNode'>;

export class CommunityPage extends Component {
  constructor({ parentNode }: CommunityPageProps) {
    super({
      parentNode,
      tagName: 'section',
      className: 'community_page',
      content: 'Community Page',
    });
  }

  destroy() {
    super.destroy();
  }
}
