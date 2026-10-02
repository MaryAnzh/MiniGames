import type { ColorVariantType, ComponentProps } from '@types';
import { Component } from 'src/components/component';
import { Skeleton } from '../skeleton/skeleton';
import { DARK } from '@constants';

type ImageProps = Pick<ComponentProps, 'parentNode'> & {
  src: string;
  alt: string;
  skeletonColor?: ColorVariantType;
};

export class Image extends Component {
  img: Component;

  constructor({ parentNode, src, alt, skeletonColor = DARK }: ImageProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'app-image',
    });
    this.img = new Component({
      parentNode: this.node,
      tagName: 'img',
      className: 'app-image_img',
      attrs: [
        { attr: 'src', value: src },
        { attr: 'alt', value: alt },
      ],
    });
    const skeleton = new Skeleton({
      parentNode: this.node,
      color: skeletonColor,
    });
    this.img.node.onload = () => {
      skeleton.destroy();
    };
  }

  destroy(): void {
    this.img.node.onload = null;
    super.destroy();
  }
}
