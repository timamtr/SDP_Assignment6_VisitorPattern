package visitor;

import element.Directory;
import element.File;
import element.FileSystemElement;

public class TreePrinterVisitor implements Visitor {
    private int depth = 0;

    @Override
    public void visitFile(File file) {
        System.out.println("  ".repeat(depth) + "- " + file.getName() + " (" + file.getSizeInBytes() + " B)");
    }

    @Override
    public void visitDirectory(Directory directory) {
        System.out.println("  ".repeat(depth) + "[" + directory.getName() + "]");
        depth++;
        for (FileSystemElement child : directory.getChildren()) {
            child.accept(this);
        }
        depth--;
    }
}

