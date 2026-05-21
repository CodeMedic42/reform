import React, { PureComponent, createRef } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';

interface TableBaseProps {
    id?: string | null;
    className?: string | null;
    children?: React.ReactNode;
    minWidth?: number | null;
    maxHeight?: number | null;
    pageTable?: boolean;
    stickyColumns?: number;
    columnWidthsFitContent?: boolean;
    useParentScroll?: boolean;
}

interface TableBaseState {
    showStickyBorder: boolean;
}

class TableBase extends PureComponent<TableBaseProps, TableBaseState> {
    containerRef: React.RefObject<HTMLDivElement>;

    constructor(props: TableBaseProps) {
        super(props);

        this.containerRef = createRef<HTMLDivElement>();

        this.state = {
            showStickyBorder: false,
        };

        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        window.document.addEventListener('scroll', this.handleScroll, {
            capture: true,
            passive: true,
        });
    }

    componentWillUnmount() {
        window.document.removeEventListener('scroll', this.handleScroll, {
            capture: true,
        });
    }

    handleScroll(e: Event) {
        const { showStickyBorder } = this.state;

        const target = e.target;
        const containerEl = this.containerRef.current;

        if (containerEl === null) {
            return;
        }

        if (!(target instanceof Element || target instanceof Document)) {
            return;
        }

        if (!target.contains(containerEl)) {
            return;
        }

        const scroller: Element | null = target instanceof Document
            ? target.scrollingElement
            : target;

        if (scroller === null) {
            return;
        }

        const { scrollLeft } = scroller;

        if (!showStickyBorder && scrollLeft > 0) {
            this.setState({
                showStickyBorder: true,
            });
        } else if (showStickyBorder && scrollLeft === 0) {
            this.setState({
                showStickyBorder: false,
            });
        }
    }

    render() {
        const {
            id = null,
            children = null,
            className = null,
            maxHeight = null,
            minWidth = 400,
            pageTable = false,
            stickyColumns = 0,
            columnWidthsFitContent = false,
            useParentScroll = false,
        } = this.props;

        const { showStickyBorder } = this.state;

        const tableStyle: React.CSSProperties = {
            tableLayout: columnWidthsFitContent ? 'auto' : 'fixed',
        };

        if (!isNil(minWidth)) {
            tableStyle.minWidth = minWidth;
        }

        return (
            <div
                id={id ?? undefined}
                className={classnames('ra-table', className, {
                    'parent-scroll': useParentScroll,
                })}
            >
                <div
                    ref={this.containerRef}
                    className={classnames('ra-table-container', {
                        'show-sticky-border': showStickyBorder,
                        'page-table': pageTable,
                        'enable-sticky': stickyColumns > 0,
                    })}
                    style={{
                        maxHeight: !isNil(maxHeight) ? `${maxHeight}px` : undefined,
                    }}
                >
                    <div className="table-content">
                        <table style={tableStyle}>
                            {children}
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default TableBase;
