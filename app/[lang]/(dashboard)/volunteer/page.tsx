"use client";

import AdvancedTemplate from "./volunteer";
import { render } from "@react-email/render";
const Advanced = () => {
    const advancedHtmlContent = render(<AdvancedTemplate />);

    return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: advancedHtmlContent }} />
        </div>
    );
};

export default Advanced;
