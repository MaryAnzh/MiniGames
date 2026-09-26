import { Component } from '@components';
import type { ComponentProps, GameCardDataType } from '@types';
import { MetaSection } from '../meta-section/meta-section';

type InfoSectionProps = Pick<ComponentProps, 'parentNode'> & { game: GameCardDataType };

export class InfoSection extends Component {
  constructor({ parentNode, game }: InfoSectionProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'game-detail_info',
    });

    this.render(game);
  }

  private render(game: GameCardDataType) {
    const { name, shortDescription, category, duration, players, price } = game;

    const titleWWap = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'game-detail_info_title-wrap',
    });

    new Component({
      parentNode: titleWWap.node,
      tagName: 'h2',
      className: 'game-detail_info_title-wrap_title',
      content: name,
    });

    new MetaSection({
      parentNode: titleWWap.node,
      game,
    });

    new Component({
      parentNode: this.node,
      tagName: 'p',
      className: 'game-detail_info_desc',
      content: shortDescription,
    });

    const widgets = [
      { key: 'Genre', value: category },
      { key: 'Players', value: players },
      { key: 'Duration', value: duration },
      { key: 'Price', value: price },
    ];

    const widgetWrap = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'game-detail_info_widgets-wrap',
    });
    widgets.forEach(({ key, value }) => {
      const tag = new Component({
        parentNode: widgetWrap.node,
        tagName: 'div',
        className: 'game-detail_info_widgets-wrap_widget',
      });
      new Component({
        parentNode: tag.node,
        tagName: 'span',
        content: key,
        className: 'game-detail_info_widgets-wrap_widget_title',
      });

      new Component({
        parentNode: tag.node,
        tagName: 'span',
        content: value,
        className: 'game-detail_info_widgets-wrap_widget_value',
      });
    });
  }
}
