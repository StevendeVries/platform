import './sw-pagination.scss';
import template from './sw-pagination.html.twig';

/**
 * @public
 * @status ready
 * @example-type static
 * @component-example
 * <sw-pagination :total="500" :limit="25" :page="1"></sw-pagination>
 */
export default {
    name: 'sw-pagination',
    template,

    props: {
        total: {
            type: Number,
            required: true
        },
        limit: {
            type: Number,
            required: true
        },
        page: {
            type: Number,
            required: true
        },
        totalVisible: {
            type: Number,
            required: false,
            default: 7
        },
        steps: {
            type: Array,
            required: false,
            default() {
                return [10, 25, 50, 75, 100];
            }
        }
    },

    data() {
        return {
            currentPage: this.page,
            perPage: this.limit
        };
    },

    computed: {
        maxPage() {
            return Math.ceil(this.total / this.perPage);
        },

        displayedPages() {
            const maxLength = this.totalVisible;
            const currentPage = this.currentPage;

            if (this.maxPage <= maxLength) {
                return this.range(1, this.maxPage);
            }

            const even = maxLength % 2 === 0 ? 1 : 0;
            const left = Math.floor(maxLength / 2);
            const right = (this.maxPage - left) + 1 + even;

            if (currentPage > left && currentPage < right) {
                const start = (currentPage - left) + 2;
                const end = (currentPage + left) - 2 - even;

                return [1, '...', ...this.range(start, end), '...', this.maxPage];
            }
            return [
                ...this.range(1, left),
                '...',
                ...this.range((this.maxPage - left) + 1 + even, this.maxPage)
            ];
        },

        shouldBeVisible() {
            return this.total > Math.min(...this.steps);
        },

        possibleSteps() {
            const total = this.total;
            const stepsSorted = [...this.steps].sort((a, b) => a - b);

            let lastStep;
            const possibleSteps = stepsSorted.filter(x => {
                if (lastStep > total) return false;
                lastStep = x;
                return true;
            });

            return possibleSteps;
        }
    },

    watch: {
        page() {
            this.currentPage = this.page;
        }
    },

    methods: {
        range(from, to) {
            const range = [];

            from = from > 0 ? from : 1;

            for (let i = from; i <= to; i += 1) {
                range.push(i);
            }
            return range;
        },

        pageChange() {
            this.$emit('page-change', {
                page: this.currentPage,
                limit: this.perPage
            });
        },

        onPageSizeChange(perPage) {
            this.perPage = Number(perPage);
            this.firstPage();
        },

        firstPage() {
            this.currentPage = 1;
            this.pageChange();
        },

        prevPage() {
            this.currentPage -= 1;
            this.pageChange();
        },

        nextPage() {
            this.currentPage += 1;
            this.pageChange();
        },

        lastPage() {
            this.currentPage = this.maxPage;
            this.pageChange();
        },

        changePageByPageNumber(pageNum) {
            this.currentPage = pageNum;
            this.pageChange();
        },

        refresh() {
            this.pageChange();
        }
    }
};
