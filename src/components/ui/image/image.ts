import type { ColorVariantType, ComponentProps } from '@types';
import { Component } from 'src/components/component';
import { Skeleton, Icon } from '@ui';
import { DARK } from '@constants';

type ImageProps = Pick<ComponentProps, 'parentNode'> & {
  src: string;
  alt: string;
  skeletonColor?: ColorVariantType;
  className?: string;
  isAvatar?: boolean;
};

export class Image extends Component {
  private img!: HTMLImageElement;
  private skeleton: Skeleton | null = null;
  private skeletonTimer: number | null = null;

  constructor({ parentNode, src, alt, skeletonColor = DARK, className, isAvatar }: ImageProps) {
    super({
      parentNode,
      tagName: 'div',
      className: ['app-image', className ?? ''],
    });

    this.img = document.createElement('img');
    this.img.className = 'app-image_img';
    this.img.alt = alt;

    if (!src) {
      this.renderEmptyIcon(isAvatar);
      return;
    }

    this.skeletonTimer = setTimeout(() => {
      this.skeleton = new Skeleton({
        parentNode: this.node,
        color: skeletonColor,
      });
    }, 1000);

    this.img.src = src;
    this.node.appendChild(this.img);
    this.img.onload = () => {
      this.clearSkeleton();
    };

    this.img.onerror = () => {
      this.clearSkeleton();
      this.renderEmptyIcon(isAvatar);
    };
  }

  private clearSkeleton() {
    if (this.skeletonTimer) {
      clearTimeout(this.skeletonTimer);
      this.skeletonTimer = null;
    }
    if (this.skeleton) {
      this.skeleton.destroy();
      this.skeleton = null;
    }
  }

  private renderEmptyIcon(isAvatar = false) {
    const imgClass = `app-image-empty${isAvatar ? '-avatar' : ''}`;

    this.node.innerHTML = '';
    this.node.classList.add(imgClass);
    new Icon({
      parentNode: this.node,
      icon: isAvatar ? 'avatar' : 'empty_img',
      className: `${imgClass}_icon`,
    });
  }

  destroy(): void {
    this.img.onload = null;
    this.img.onerror = null;

    if (this.skeletonTimer) {
      clearTimeout(this.skeletonTimer);
    }

    super.destroy();
  }
}
