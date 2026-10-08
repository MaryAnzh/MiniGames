import { Component } from '@components';
import type { ComponentProps } from '@types';
import { getInitials, getProfileName, getRandomAvatarColor } from '@utils';
import { Image } from '@ui';

type AvatarProps = Pick<ComponentProps, 'parentNode'> & {
  className: string;
  avatarUrl?: string;
  username?: string;
  email?: string;
};
export class Avatar extends Component {
  constructor({ parentNode, className, username = '', avatarUrl = '', email = '' }: AvatarProps) {
    super({
      parentNode,
      tagName: 'div',
      className: ['app-avatar', className ?? ''],
    });

    const displayName = getProfileName({ email, username });
    const initial = getInitials(displayName);

    new Component({
      parentNode: this.node,
      tagName: 'span',
      className: 'app-avatar_name',
      content: displayName,
    });
    const avatarWrap = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'app-avatar_img-wrap',
      content: avatarUrl ? undefined : initial,
      attrs: [
        {
          attr: 'style',
          value: `background: var(${getRandomAvatarColor().token})`,
        },
        { attr: 'title', value: displayName },
      ],
    });
    if (avatarUrl) {
      new Image({
        parentNode: avatarWrap.node,
        src: avatarUrl,
        alt: 'USer avatar',
        isAvatar: true,
      });
    }
  }
}
