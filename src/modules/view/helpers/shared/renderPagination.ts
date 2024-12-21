import {  PaginationMeta } from "../../../paginate";

export const renderPagination = (meta :PaginationMeta )=>{
    const { lastPage, currentPage} = meta;
    const totalPages = lastPage;

    return `
    <div class="block-27 pagination-panel">
        <ul>
            <li><a href="#" data-page="${currentPage - 1}" ${currentPage <= 1 ? 'class="disabled"' : ''}>&lt;</a></li>
            ${Array.from({ length: totalPages }, (_, i) => `
                <li ${i + 1 === currentPage ? 'class="active"' : ''}>
                    <a href="#" data-page="${i + 1}">${i + 1}</a>
                </li>
            `).join('')}
            <li><a href="#" data-page="${currentPage + 1}" ${currentPage >= totalPages ? 'class="disabled"' : ''}>&gt;</a></li>
        </ul>
    </div>
    `;
}