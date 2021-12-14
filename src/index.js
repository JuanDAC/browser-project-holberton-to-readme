(() => {
    const regex = Object.freeze({
        headers: /^H(\d)/,
        unorderList: /^UL$/,
        paragraph: /^P$/,
        anchor: /^A$/,
        image: /^IMG$/,
        code: /^CODE$/,
    });


    const downloadReadme = (text) => {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/markdown;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', 'README.md');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }


    const addTaps = (string) => `* ${string}\n`;
    const HTML2README = (element) => {
        if (!element) {
            return '';
        }
        if (element.data) {
            let { data } = element;
            if (data && data.length) {
                data = data.replaceAll(/\n/g, '');
                if (data.replaceAll(/ /g, '').length == 0) {
                    return '';
                };
                return data;
            }

        }
        const { tagName, outerText, childNodes, classList } = element;
        if (classList && classList.contains('panel-footer')) {
            return '\n';
        }
        if (tagName && regex.headers.test(tagName)) {
            const { 1: number } = tagName.match(regex.headers);
            const repeat = parseInt(number) || 1;
            return `${'#'.repeat(repeat)} ${outerText}\n`;
        }
        if (tagName && regex.image.test(tagName)) {
            const { alt, src } = element;
            return ` ![${alt}](${src}) \n`;
        }
        if (tagName && regex.anchor.test(tagName)) {
            const { href } = element;
            return `[${outerText}](${href}) \n`;
        }
        if (tagName && regex.code.test(tagName)) {
            if (outerText.length > 100) {
                return `\`\`\`bash\n${outerText}\n\`\`\`\n`;
            }
            return ` \` ${outerText} \` `;
        }
        if (childNodes && childNodes.length) {
            if (classList.contains('metadata'))
                return `## Details\n${[...childNodes].map(HTML2README).filter(Boolean).join('')}`;
            if (regex.unorderList.test(tagName)) {
                return `${[...childNodes].map(HTML2README).filter(Boolean).map(addTaps).join('')}`;
            }
            if (regex.paragraph.test(tagName)) {
                return `${([...childNodes].map(HTML2README)).filter(Boolean).join(' ')}\n`;
            }

            return `${([...childNodes].map(HTML2README)).filter(Boolean).join('')}`;
        }
        if (tagName && regex.paragraph.test(tagName)) {
            return `${outerText}\n`;
        }

        return outerText || '';
    }

    const READMEFROM = () => downloadReadme(HTML2README(document.querySelector('.project.row')));


    READMEFROM();
})();